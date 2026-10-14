import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { durationSeconds, isLiveCandidate, isActiveLive, selectLatestUpload, type YouTubeVideo, type ShortsIndex } from "./video-utils";

export const runtime = "nodejs";

const CHANNEL_ID = "UCBvSY3MYEkkJ194_Zdjp2Jw";
const API_BASE = "https://www.googleapis.com/youtube/v3";
const CACHE_VERSION = "aquari-youtube-v3";
const RECENT_TTL = 180;
// Only this discovery step uses search.list. Share it across visitors.
const LIVE_SEARCH_TTL = 1800;
const LIVE_DETAIL_TTL = 60;
const SHORTS_TTL = 900;
const MAX_STALE_SECONDS = 7 * 24 * 60 * 60;
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

type VideoCard = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  embeddable: boolean;
  publishedAt: string | null;
};
type Snapshot<T> = { value: T; checkedAt: string };
type Section = {
  status: "ok" | "stale" | "error" | "unconfigured";
  checkedAt: string | null;
};
type ApiList<T> = { items?: T[]; nextPageToken?: string };
type PlaylistItem = { contentDetails?: { videoId?: string } };
type SearchItem = { id?: { videoId?: string } };

class YouTubeError extends Error {
  constructor(public readonly code: string) {
    super(code);
    this.name = "YouTubeError";
  }
}

function snapshot<T>(value: T): Snapshot<T> {
  return { value, checkedAt: new Date().toISOString() };
}

async function youtubeFetch<T>(path: string, params: Record<string, string>): Promise<ApiList<T>> {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  if (!apiKey) throw new YouTubeError("configuration");

  const url = new URL(`${API_BASE}/${path}`);
  for (const [key, value] of Object.entries({ ...params, key: apiKey })) {
    url.searchParams.set(key, value);
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    // Caching is performed by the feature-level unstable_cache wrappers below.
    const response = await fetch(url, { cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new YouTubeError(`upstream_${response.status}`);
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || !Array.isArray((data as ApiList<T>).items)) {
      throw new YouTubeError("invalid_response");
    }
    return data as ApiList<T>;
  } catch (error) {
    if (error instanceof YouTubeError) throw error;
    throw new YouTubeError(controller.signal.aborted ? "timeout" : "unavailable");
  } finally {
    clearTimeout(timeout);
  }
}

function safeLog(feature: string, error: unknown) {
  // Do not log upstream URLs, response bodies, or the API key.
  console.error(`[YouTube:${feature}]`, error instanceof YouTubeError ? error.code : "unavailable");
}

function isPublicChannelVideo(video: YouTubeVideo) {
  return VIDEO_ID.test(video.id) && video.snippet?.channelId === CHANNEL_ID
    && video.status?.privacyStatus === "public";
}

function toCard(video: YouTubeVideo, isShort = false): VideoCard {
  const thumbnails = video.snippet?.thumbnails;
  const thumbnail = ["maxres", "standard", "high", "medium", "default"]
    .map((size) => thumbnails?.[size]?.url)
    .find((url) => {
      if (!url) return false;
      try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" && ["i.ytimg.com", "img.youtube.com"].includes(parsed.hostname);
      } catch { return false; }
    }) || `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
  return {
    id: video.id,
    title: video.snippet?.title || (isShort ? "Short動画" : "YouTube動画"),
    thumbnail,
    url: isShort ? `https://www.youtube.com/shorts/${video.id}` : `https://www.youtube.com/watch?v=${video.id}`,
    embeddable: video.status?.embeddable === true,
    publishedAt: video.snippet?.publishedAt || null,
  };
}

async function playlistVideoIds(playlistId: string, maxPages: number): Promise<{ ids: string[]; complete: boolean }> {
  const ids: string[] = [];
  let pageToken = "";
  for (let page = 0; page < maxPages; page++) {
    const data = await youtubeFetch<PlaylistItem>("playlistItems", {
      part: "contentDetails", playlistId, maxResults: "50", ...(pageToken ? { pageToken } : {}),
    });
    for (const item of data.items || []) {
      const id = item.contentDetails?.videoId;
      if (id && VIDEO_ID.test(id)) ids.push(id);
    }
    pageToken = data.nextPageToken || "";
    if (!pageToken) break;
  }
  return { ids: [...new Set(ids)], complete: !pageToken };
}

async function videoDetails(ids: string[]): Promise<YouTubeVideo[]> {
  const batches: string[][] = [];
  for (let i = 0; i < ids.length; i += 50) batches.push(ids.slice(i, i + 50));
  const responses = await Promise.all(batches.map((batch) => youtubeFetch<YouTubeVideo>("videos", {
    part: "snippet,contentDetails,status,liveStreamingDetails", id: batch.join(","),
  })));
  return responses.flatMap((response) => response.items || []).filter(isPublicChannelVideo);
}

const uploadsPlaylist = unstable_cache(async () => {
  const data = await youtubeFetch<{
    contentDetails?: { relatedPlaylists?: { uploads?: string } };
  }>("channels", { part: "contentDetails", id: CHANNEL_ID });
  const id = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!id) throw new YouTubeError("channel_unavailable");
  return id;
}, [CACHE_VERSION, CHANNEL_ID, "uploads-id"], { revalidate: 86400 });

const recentVideos = unstable_cache(async () => {
  const playlistId = await uploadsPlaylist();
  const { ids } = await playlistVideoIds(playlistId, 2);
  return snapshot(await videoDetails(ids));
}, [CACHE_VERSION, CHANNEL_ID, "recent"], { revalidate: RECENT_TTL });

const discoverLive = unstable_cache(async () => {
  const data = await youtubeFetch<SearchItem>("search", {
    part: "id", channelId: CHANNEL_ID, eventType: "live", type: "video", order: "date", maxResults: "5",
  });
  return snapshot((data.items || []).flatMap((item) => {
    const id = item.id?.videoId;
    return id && VIDEO_ID.test(id) ? [id] : [];
  }));
}, [CACHE_VERSION, CHANNEL_ID, "live-search"], { revalidate: LIVE_SEARCH_TTL });

const liveDetails = unstable_cache(async (ids: string[]) => snapshot(await videoDetails(ids)),
  [CACHE_VERSION, CHANNEL_ID, "live-details"], { revalidate: LIVE_DETAIL_TTL });

const shortsFromPlaylist = unstable_cache(async (playlistId: string) => {
  if (!/^[A-Za-z0-9_-]{10,100}$/.test(playlistId)) throw new YouTubeError("shorts_configuration");
  // A Shorts-only playlist (including the channel-generated Shorts playlist).
  // Hashtags, duration alone and thumbnail dimensions do not prove Shorts status.
  const { ids, complete } = await playlistVideoIds(playlistId, 5);
  const videos = await videoDetails(ids);
  const candidates = videos.filter((video) => {
    const seconds = durationSeconds(video.contentDetails?.duration);
    return seconds !== null && seconds > 0 && seconds <= 180
      && video.snippet?.liveBroadcastContent === "none"
      && !video.liveStreamingDetails?.actualStartTime
      && !video.liveStreamingDetails?.scheduledStartTime
      && !video.liveStreamingDetails?.actualEndTime;
  }).sort((a, b) => Date.parse(b.snippet?.publishedAt || "") - Date.parse(a.snippet?.publishedAt || ""));
  return snapshot({ ids, complete, latest: candidates[0] ? toCard(candidates[0], true) : null });
}, [CACHE_VERSION, CHANNEL_ID, "shorts"], { revalidate: SHORTS_TTL });

function resolveSnapshot<T>(data: Snapshot<T>, freshSeconds: number, empty: T): { value: T; section: Section } {
  const age = (Date.now() - Date.parse(data.checkedAt)) / 1000;
  if (!Number.isFinite(age) || age > MAX_STALE_SECONDS) {
    return { value: empty, section: { status: "error", checkedAt: data.checkedAt } };
  }
  return { value: data.value, section: { status: age > freshSeconds * 2 ? "stale" : "ok", checkedAt: data.checkedAt } };
}

async function loadLive(recent: Promise<Snapshot<YouTubeVideo[]>>): Promise<{ value: VideoCard | null; section: Section }> {
  const [index, discovery] = await Promise.allSettled([recent, discoverLive()]);
  const recentLive = index.status === "fulfilled" ? index.value.value.filter(isLiveCandidate) : [];
  const ids = [...new Set([
    ...recentLive.map((video) => video.id),
    ...(discovery.status === "fulfilled" ? discovery.value.value : []),
  ])].sort();
  if (ids.length) {
    const details = await liveDetails(ids);
    if (Date.now() - Date.parse(details.checkedAt) > LIVE_DETAIL_TTL * 2 * 1000) {
      throw new YouTubeError("live_status_stale");
    }
    const active = details.value.filter(isActiveLive)
      .sort((a, b) => Date.parse(b.liveStreamingDetails?.actualStartTime || b.snippet?.publishedAt || "")
        - Date.parse(a.liveStreamingDetails?.actualStartTime || a.snippet?.publishedAt || ""))[0];
    if (active) return { value: toCard(active), section: { status: "ok", checkedAt: details.checkedAt } };
  }
  if (discovery.status === "rejected") throw discovery.reason;
  if (Date.now() - Date.parse(discovery.value.checkedAt) > LIVE_SEARCH_TTL * 2 * 1000) {
    throw new YouTubeError("live_status_stale");
  }
  return { value: null, section: { status: "ok", checkedAt: discovery.value.checkedAt } };
}

async function loadArchive(recent: Promise<Snapshot<YouTubeVideo[]>>) {
  const data = await recent;
  const video = data.value.filter((item) => item.liveStreamingDetails?.actualEndTime)
    .sort((a, b) => Date.parse(b.liveStreamingDetails!.actualEndTime!) - Date.parse(a.liveStreamingDetails!.actualEndTime!))[0];
  return resolveSnapshot<VideoCard | null>({ value: video ? toCard(video) : null, checkedAt: data.checkedAt }, RECENT_TTL, null);
}

async function loadVideo(recent: Promise<Snapshot<YouTubeVideo[]>>, shorts: Promise<Snapshot<{ ids: string[]; complete: boolean; latest: VideoCard | null }>> | null) {
  const [index, catalog] = await Promise.all([recent, shorts?.catch(() => null) ?? null]);
  const freshCatalog: ShortsIndex | null = catalog && Date.now() - Date.parse(catalog.checkedAt) <= SHORTS_TTL * 2 * 1000
    ? { ids: catalog.value.ids, complete: catalog.value.complete, checkedAt: catalog.checkedAt } : null;
  const result = selectLatestUpload(index.value, freshCatalog);
  if (result.uncertain) throw new YouTubeError("video_classification_pending");
  return resolveSnapshot<VideoCard | null>({ value: result.video ? toCard(result.video) : null, checkedAt: index.checkedAt }, RECENT_TTL, null);
}

// Coalesce simultaneous visitors within a server instance. Next's Data Cache
// supplies cross-request persistence; this promise is not a durable cache.
let inFlight: Promise<{ body: object; status: number }> | null = null;

async function buildResponse() {
  const recent = recentVideos();
  const shortsId = process.env.YOUTUBE_SHORTS_PLAYLIST_ID?.trim();
  const shorts = shortsId ? shortsFromPlaylist(shortsId) : null;
  const results = await Promise.allSettled([
    loadLive(recent),
    loadArchive(recent),
    shorts ? shorts.then((data) => resolveSnapshot({ value: data.value.latest, checkedAt: data.checkedAt }, SHORTS_TTL, null))
      : Promise.resolve({ value: null, section: { status: "unconfigured" as const, checkedAt: null } }),
    loadVideo(recent, shorts),
  ]);
  const names = ["live", "archive", "shorts", "video"] as const;
  const sections = {} as Record<typeof names[number], Section>;
  const values: (VideoCard | null)[] = [];
  results.forEach((result, index) => {
    const name = names[index];
    if (result.status === "fulfilled") {
      sections[name] = result.value.section;
      values[index] = result.value.value;
    } else {
      safeLog(name, result.reason);
      sections[name] = { status: "error", checkedAt: null };
      values[index] = null;
    }
  });
  const configured = Object.values(sections).filter((section) => section.status !== "unconfigured");
  const allFailed = configured.every((section) => section.status === "error");
  return {
    status: allFailed ? 503 : 200,
    body: {
      currentLive: values[0], latestArchive: values[1], latestShort: values[2], latestVideo: values[3],
      sections, checkedAt: new Date().toISOString(),
    },
  };
}

export async function GET() {
  if (!inFlight) inFlight = buildResponse().finally(() => { inFlight = null; });
  const result = await inFlight;
  return NextResponse.json(result.body, {
    status: result.status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...(result.status === 503 ? { "Retry-After": "300" } : {}),
    },
  });
}
