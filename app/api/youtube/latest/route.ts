import { NextResponse } from "next/server";

const API_KEY = process.env.YOUTUBE_API_KEY=あなたのAPIキー
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID=UCBvSY3MYEkkJ194_Zdjp2Jw
export async function GET() {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: "YOUTUBE_API_KEY が設定されていません" },
        { status: 500 }
      );
    }

    if (!CHANNEL_ID) {
      return NextResponse.json(
        { error: "YOUTUBE_CHANNEL_ID が設定されていません" },
        { status: 500 }
      );
    }

    const url =
      `https://www.googleapis.com/youtube/v3/search` +
      `?part=snippet` +
      `&channelId=${CHANNEL_ID}` +
      `&order=date` +
      `&maxResults=1` +
      `&type=video` +
      `&key=${API_KEY}`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    const data = await res.json();

    console.log("YouTube API data:", data);

    if (!res.ok) {
      return NextResponse.json(
        { error: "YouTube API の取得に失敗しました", details: data },
        { status: res.status }
      );
    }

    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: "動画が見つかりませんでした", items: [] },
        { status: 404 }
      );
    }

    const item = data.items[0];
    const videoId = item?.id?.videoId;

    if (!videoId) {
      return NextResponse.json(
        { error: "videoId が取得できませんでした", item },
        { status: 404 }
      );
    }

    return NextResponse.json({
      videoId,
      title: item?.snippet?.title ?? "",
      thumbnail: item?.snippet?.thumbnails?.high?.url ?? "",
      publishedAt: item?.snippet?.publishedAt ?? "",
    });
  } catch (error) {
    console.error("route.ts error:", error);

    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}