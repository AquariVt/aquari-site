import { NextResponse } from "next/server";

const API_BASE = "https://www.googleapis.com/youtube/v3";
const CHANNEL_ID = "UCBvSY3MYEkkJ194_Zdjp2Jw";

type ThumbnailSet = {
  default?: { url: string };
  medium?: { url: string };
  high?: { url: string };
  standard?: { url: string };
  maxres?: { url: string };
};

type PlaylistItem = {
  snippet?: {
    title?: string;
    description?: string;
    resourceId?: {
      videoId?: string;
    };
    thumbnails?: ThumbnailSet;
  };
};

type VideoItem = {
  id: string;
  snippet?: {
    title?: string;
    description?: string;
    liveBroadcastContent?: string;
    thumbnails?: ThumbnailSet;
  };
  contentDetails?: {
    duration?: string;
  };
};

type SearchItem = {
  id?: {
    videoId?: string;
  };
  snippet?: {
    title?: string;
    description?: string;
    thumbnails?: ThumbnailSet;
  };
};

function pickThumbnail(thumbnails?: ThumbnailSet): string {
  return (
    thumbnails?.maxres?.url ||
    thumbnails?.standard?.url ||
    thumbnails?.high?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url ||
    ""
  );
}

function parseISODurationToSeconds(duration?: string): number {
  if (!duration) return 0;

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);

  return hours * 3600 + minutes * 60 + seconds;
}

async function youtubeFetch(path: string, params: Record<string, string>) {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY is missing");
  }

  const url = new URL(`${API_BASE}/${path}`);
  Object.entries({ ...params, key: apiKey }).forEach(([k, v]) => {
    url.searchParams.set(k, v);
  });

  const res = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YouTube API error ${res.status}: ${text}`);
  }

  return res.json();
}

export async function GET() {
  try {
    const channelRes = await youtubeFetch("channels", {
      part: "contentDetails",
      id: CHANNEL_ID,
    });

    const uploadsPlaylistId =
      channelRes.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      throw new Error("uploads playlist not found");
    }

    const uploadsRes = await youtubeFetch("playlistItems", {
      part: "snippet",
      playlistId: uploadsPlaylistId,
      maxResults: "10",
    });

    const uploadItems = (uploadsRes.items || []) as PlaylistItem[];

    const uploadVideoIds = uploadItems
      .map((item) => item.snippet?.resourceId?.videoId)
      .filter(Boolean)
      .join(",");

    let latestShort = null;

    if (uploadVideoIds) {
      const uploadVideosRes = await youtubeFetch("videos", {
        part: "snippet,contentDetails",
        id: uploadVideoIds,
      });

      const uploadVideos = (uploadVideosRes.items || []) as VideoItem[];

      latestShort =
        uploadVideos
          .filter((video) => {
            const title = (video.snippet?.title || "").toLowerCase();
            const description = (video.snippet?.description || "").toLowerCase();
            const duration = parseISODurationToSeconds(
              video.contentDetails?.duration
            );
            const isLiveLike =
              video.snippet?.liveBroadcastContent &&
              video.snippet.liveBroadcastContent !== "none";

            if (isLiveLike) return false;

            return (
              title.includes("#shorts") ||
              description.includes("#shorts") ||
              duration <= 180
            );
          })
          .map((video) => ({
            id: video.id,
            title: video.snippet?.title || "Short動画",
            thumbnail: pickThumbnail(video.snippet?.thumbnails),
            url: `https://www.youtube.com/watch?v=${video.id}`,
          }))[0] || null;
    }

    const archiveSearchRes = await youtubeFetch("search", {
      part: "snippet",
      channelId: CHANNEL_ID,
      eventType: "completed",
      maxResults: "5",
      order: "date",
      type: "video",
    });

    const archiveIds = (archiveSearchRes.items || [])
      .map((item: SearchItem) => item.id?.videoId)
      .filter(Boolean)
      .join(",");

    let latestArchive = null;

    if (archiveIds) {
      const archiveVideosRes = await youtubeFetch("videos", {
        part: "snippet",
        id: archiveIds,
      });

      const archiveVideos = (archiveVideosRes.items || []) as VideoItem[];
      const firstArchive = archiveVideos[0];

      if (firstArchive) {
        latestArchive = {
          id: firstArchive.id,
          title: firstArchive.snippet?.title || "配信アーカイブ",
          thumbnail: pickThumbnail(firstArchive.snippet?.thumbnails),
          url: `https://www.youtube.com/watch?v=${firstArchive.id}`,
        };
      }
    }

    const liveSearchRes = await youtubeFetch("search", {
      part: "snippet",
      channelId: CHANNEL_ID,
      eventType: "live",
      maxResults: "1",
      order: "date",
      type: "video",
    });

    const liveItem = (liveSearchRes.items || [])[0] as SearchItem | undefined;

    const currentLive =
      liveItem?.id?.videoId
        ? {
            id: liveItem.id.videoId,
            title: liveItem.snippet?.title || "ライブ配信中",
            thumbnail: pickThumbnail(liveItem.snippet?.thumbnails),
            url: `https://www.youtube.com/watch?v=${liveItem.id.videoId}`,
          }
        : null;

    return NextResponse.json({
      latestShort,
      latestArchive,
      currentLive,
    });
  } catch (error) {
    console.error("youtube latest route error:", error);

    return NextResponse.json(
      {
        latestShort: null,
        latestArchive: null,
        currentLive: null,
      },
      { status: 200 }
    );
  }
}