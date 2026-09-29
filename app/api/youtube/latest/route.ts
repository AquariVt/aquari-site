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
    thumbnails?: ThumbnailSet;
    liveBroadcastContent?: string;
  };
  contentDetails?: {
    duration?: string;
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

function durationToSeconds(duration?: string): number {
  if (!duration) return 999999;

  const match = duration.match(
    /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
  );

  if (!match) return 999999;

  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);

  return hours * 3600 + minutes * 60 + seconds;
}

async function youtubeFetch(
  path: string,
  params: Record<string, string>
) {
  if (!API_KEY) {
    throw new Error("YOUTUBE_API_KEY が設定されていません");
  }

  const url = new URL(`${API_BASE}/${path}`);

  Object.entries({
    ...params,
    key: API_KEY,
  }).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `YouTube API Error ${response.status}: ${text}`
    );
  }

  return response.json();
}

export async function GET() {
  try {
    // =========================
    // 現在のYouTubeライブ
    // =========================

    const liveResponse = await youtubeFetch("search", {
      part: "snippet",
      channelId: CHANNEL_ID,
      eventType: "live",
      type: "video",
      maxResults: "1",
    });

    const liveItem = (liveResponse.items || [])[0] as
      | SearchItem
      | undefined;

    const currentLive = liveItem?.id?.videoId
      ? {
          id: liveItem.id.videoId,
          title: liveItem.snippet?.title || "YouTube配信中",
          thumbnail: pickThumbnail(liveItem.snippet?.thumbnails),
          url: `https://www.youtube.com/watch?v=${liveItem.id.videoId}`,
        }
      : null;

    // =========================
    // 最新ライブアーカイブ
    // =========================

    const archiveResponse = await youtubeFetch("search", {
      part: "snippet",
      channelId: CHANNEL_ID,
      eventType: "completed",
      type: "video",
      order: "date",
      maxResults: "1",
    });

    const archiveItem = (archiveResponse.items || [])[0] as
      | SearchItem
      | undefined;

    const latestArchive = archiveItem?.id?.videoId
      ? {
          id: archiveItem.id.videoId,
          title: archiveItem.snippet?.title || "最新アーカイブ",
          thumbnail: pickThumbnail(archiveItem.snippet?.thumbnails),
          url: `https://www.youtube.com/watch?v=${archiveItem.id.videoId}`,
        }
      : null;

    // =========================
    // 最新Short
    // =========================

    let latestShort: {
      id: string;
      title: string;
      thumbnail: string;
      url: string;
    } | null = null;

    // チャンネルのアップロードプレイリストを取得
    const channelResponse = await youtubeFetch("channels", {
      part: "contentDetails",
      id: CHANNEL_ID,
    });

    const uploadsPlaylistId =
      channelResponse.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (uploadsPlaylistId) {
      // 最新50件まで確認
      const uploadsResponse = await youtubeFetch("playlistItems", {
        part: "snippet",
        playlistId: uploadsPlaylistId,
        maxResults: "50",
      });

      const uploads = (uploadsResponse.items || []) as PlaylistItem[];

      const ids = uploads
        .map((item) => item.snippet?.resourceId?.videoId)
        .filter((id): id is string => Boolean(id));

      if (ids.length > 0) {
        const videosResponse = await youtubeFetch("videos", {
          part: "snippet,contentDetails",
          id: ids.join(","),
        });

        const videos = (videosResponse.items || []) as VideoItem[];

        const videoMap = new Map(
          videos.map((video) => [video.id, video])
        );

        // アップロード順を維持
        const orderedVideos = ids
          .map((id) => videoMap.get(id))
          .filter(
            (video): video is VideoItem => Boolean(video)
          );

        const shortVideo = orderedVideos.find((video) => {
          const title =
            video.snippet?.title?.toLowerCase() || "";

          const description =
            video.snippet?.description?.toLowerCase() || "";

          const seconds = durationToSeconds(
            video.contentDetails?.duration
          );

          const liveState =
            video.snippet?.liveBroadcastContent;

          // ライブ・配信予定はShort判定から除外
          if (liveState === "live" || liveState === "upcoming") {
            return false;
          }

          return (
            title.includes("#shorts") ||
            description.includes("#shorts") ||
            seconds <= 180
          );
        });

        if (shortVideo) {
          latestShort = {
            id: shortVideo.id,
            title:
              shortVideo.snippet?.title ||
              "最新Short動画",
            thumbnail: pickThumbnail(
              shortVideo.snippet?.thumbnails
            ),
            url: `https://www.youtube.com/shorts/${shortVideo.id}`,
          };
        }
      }
    }

    // =========================
    // Shortが見つからない場合の予備検索
    // =========================

    if (!latestShort) {
      const shortSearchResponse = await youtubeFetch("search", {
        part: "snippet",
        channelId: CHANNEL_ID,
        q: "#shorts",
        type: "video",
        order: "date",
        maxResults: "10",
      });

      const shortSearchItem = (
        shortSearchResponse.items || []
      )[0] as SearchItem | undefined;

      if (shortSearchItem?.id?.videoId) {
        latestShort = {
          id: shortSearchItem.id.videoId,
          title:
            shortSearchItem.snippet?.title ||
            "最新Short動画",
          thumbnail: pickThumbnail(
            shortSearchItem.snippet?.thumbnails
          ),
          url: `https://www.youtube.com/shorts/${shortSearchItem.id.videoId}`,
        };
      }
    }

    return NextResponse.json({
      currentLive,
      latestArchive,
      latestShort,
    });
  } catch (error) {
    console.error("YouTube API取得エラー:", error);

    return NextResponse.json(
      {
        currentLive: null,
        latestArchive: null,
        latestShort: null,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}