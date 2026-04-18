import { NextResponse } from "next/server";

const API_BASE = "https://www.googleapis.com/youtube/v3";
const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = "UCBvSY3MYEkkJ194_Zdjp2Jw";

type ThumbnailSet = {
  default?: { url: string };
  medium?: { url: string };
  high?: { url: string };
  standard?: { url: string };
  maxres?: { url: string };
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

async function youtubeFetch(path: string, params: Record<string, string>) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "YOUTUBE_API_KEY が設定されていません" },
      { status: 500 }
    );
  }

  const url = new URL(`${API_BASE}/${path}`);
  Object.entries({ ...params, key: API_KEY }).forEach(([k, v]) => {
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
    const liveRes = await youtubeFetch("search", {
      part: "snippet",
      channelId: CHANNEL_ID,
      eventType: "live",
      type: "video",
      maxResults: "1",
    });

    if (liveRes instanceof NextResponse) return liveRes;

    const liveItem = (liveRes.items || [])[0] as SearchItem | undefined;
    const currentLive = liveItem?.id?.videoId
      ? {
          id: liveItem.id.videoId,
          title: liveItem.snippet?.title || "配信中",
          thumbnail: pickThumbnail(liveItem.snippet?.thumbnails),
          url: `https://www.youtube.com/watch?v=${liveItem.id.videoId}`,
        }
      : null;

    const archiveRes = await youtubeFetch("search", {
      part: "snippet",
      channelId: CHANNEL_ID,
      eventType: "completed",
      type: "video",
      order: "date",
      maxResults: "1",
    });

    if (archiveRes instanceof NextResponse) return archiveRes;

    const archiveItem = (archiveRes.items || [])[0] as SearchItem | undefined;
    const latestArchive = archiveItem?.id?.videoId
      ? {
          id: archiveItem.id.videoId,
          title: archiveItem.snippet?.title || "最新アーカイブ",
          thumbnail: pickThumbnail(archiveItem.snippet?.thumbnails),
          url: `https://www.youtube.com/watch?v=${archiveItem.id.videoId}`,
        }
      : null;

    const shortRes = await youtubeFetch("search", {
      part: "snippet",
      channelId: CHANNEL_ID,
      type: "video",
      order: "date",
      q: "#shorts",
      maxResults: "5",
    });

    if (shortRes instanceof NextResponse) return shortRes;

    const shortItem = (shortRes.items || [])[0] as SearchItem | undefined;
    const latestShort = shortItem?.id?.videoId
      ? {
          id: shortItem.id.videoId,
          title: shortItem.snippet?.title || "最新Short動画",
          thumbnail: pickThumbnail(shortItem.snippet?.thumbnails),
          url: `https://www.youtube.com/watch?v=${shortItem.id.videoId}`,
        }
      : null;

    return NextResponse.json({
      currentLive,
      latestArchive,
      latestShort,
    });
  } catch (error) {
    console.error("youtube latest route error:", error);

    return NextResponse.json(
      {
        currentLive: null,
        latestArchive: null,
        latestShort: null,
      },
      { status: 200 }
    );
  }
}