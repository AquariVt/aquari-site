"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type VideoItem = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
};

type LatestResponse = {
  latestShort: VideoItem | null;
  latestArchive: VideoItem | null;
  currentLive: VideoItem | null;
};

type ScheduleItem = {
  day: string;
  time: string;
  title: string;
  note: string;
  color: string;
};

const weeklySchedule: ScheduleItem[] = [
  {
    day: "月曜日",
    time: "19:00〜",
    title: "Escape from Tarkov",
    note: "参加型配信",
    color: "border-dark blue-400/30 bg-red-500/15",
  },
{
    day: "火曜日",
    time: "19:00〜",
    title: "Escape from Tarkov",
    note: "参加型配信",
    color: "border-dark blue-400/30 bg-red-500/15",
  },
  {
    day: "水曜日",
    time: "21:00〜",
    title: "Among Us",
    note: "コラボ配信",
    color: "border-dark blue-400/30 bg-cyan-500/15",
  },
{
    day: "木曜日",
    time: "19:00〜",
    title: "Escape from Tarkov",
    note: "参加型配信",
    color: "border-dark blue-400/30 bg-red-500/15",
  },
  {
    day: "金曜日",
    time: "20:00〜",
    title: "Escape from Tarkov",
    note: "参加型予定",
    color: "border-dark blue-400/30 bg-purple-500/15",
  },
{
    day: "土曜日",
    time: "21:00〜",
    title: "ASCEND WITHOUT LIMIT杯(Apex Legends)",
    note: "大会配信",
    color: "border-red-400/30 bg-red-500/15",
  },
  {
    day: "日曜日",
    time: "未定",
    title: "調整中",
    note: "予定変更あり",
    color: "border-slate-400/30 bg-slate-500/15",
  },
];

export default function Home() {
  const [twitchSrc, setTwitchSrc] = useState("");
  const [latest, setLatest] = useState<LatestResponse>({
    latestShort: null,
    latestArchive: null,
    currentLive: null,
  });
  const [loading, setLoading] = useState(true);

  const fixedVideoId = "HuQbQ9e4eJ8";
  const fixedVideoUrl = "https://youtu.be/HuQbQ9e4eJ8";
  const fixedThumbnail = `https://img.youtube.com/vi/${fixedVideoId}/hqdefault.jpg`;

  useEffect(() => {
    const host = window.location.hostname || "localhost";
    setTwitchSrc(`https://player.twitch.tv/?channel=aquarivt&parent=${host}`);

    const loadLatest = async () => {
      try {
        const res = await fetch("/api/youtube/latest", { cache: "no-store" });
        const data: LatestResponse = await res.json();
        setLatest(data);
      } catch (error) {
        console.error("YouTube latest load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLatest();
  }, []);

  const youtubeDisplay = latest.currentLive ?? latest.latestArchive;
  const isLive = !!latest.currentLive;

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/aquari-bg.png')" }}
      />
      <div className="fixed inset-0 -z-10 bg-slate-950/80 backdrop-blur-[3px]" />

      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
        <header className="mb-10 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md md:p-10">
          <div className="inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
            SIRIUS GAMING / 九尾系Vtuber
          </div>

          <h1 className="mt-5 text-5xl font-black tracking-tight md:text-7xl">
            Aquari
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200 md:text-lg">
            SIRIUS GAMINGストリーマー部門所属の九尾系Vtuber。
            神社に仕える狐巫女でありながら、人間に紛れて日々ゲーム配信を行っている。
            旅やサッカー観戦を好み、PCゲームではFPSを中心に活動中。
          </p>

          {isLive && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-red-300/40 bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-[0_0_20px_rgba(239,68,68,0.45)]">
              <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
              現在YouTube配信中
            </div>
          )}
        </header>

        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.25fr]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">タグ一覧</h2>

              <div className="space-y-3 text-slate-200">
                <p>
                  配信（切り抜きも）：
                  <a
                    href="https://x.com/search?q=%23Aquari%E9%85%8D%E4%BF%A1&src=typed_query"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sky-300 underline underline-offset-4 hover:text-sky-200"
                  >
                    #Aquari配信
                  </a>
                </p>

                <p>
                  エゴサ：
                  <a
                    href="https://x.com/search?q=%23%E3%82%A2%E3%82%AF%E3%82%A8%E3%83%AA%E6%B0%B4%E6%97%8F%E9%A4%A8&src=typed_query"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sky-300 underline underline-offset-4 hover:text-sky-200"
                  >
                    #アクエリ水族館
                  </a>
                </p>

                <p>
                  ファンアート：
                  <a
                    href="https://x.com/search?q=%23%E3%82%A2%E3%82%AF%E3%82%A8%E3%83%AA%E3%82%A2%E3%83%BC%E3%83%88&src=typed_query"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sky-300 underline underline-offset-4 hover:text-sky-200"
                  >
                    #アクエリアート
                  </a>
                </p>

                <p>
                  R18FA用：
                  <a
                    href="https://x.com/search?q=%23%E3%82%A2%E3%82%AF%E3%82%A8%E3%83%AA%E9%A3%B2%E3%82%93%E3%81%A0&src=typed_query"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sky-300 underline underline-offset-4 hover:text-sky-200"
                  >
                    #アクエリ飲んだ
                  </a>
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">SNS / Channel</h2>

              <div className="grid gap-3">
                <a
                  href="https://x.com/Aquari_Vt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-sky-500 px-4 py-3 text-center font-bold transition hover:bg-sky-600"
                >
                  X
                </a>

                <a
                  href="https://www.youtube.com/channel/UCBvSY3MYEkkJ194_Zdjp2Jw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-red-500 px-4 py-3 text-center font-bold transition hover:bg-red-600"
                >
                  YouTube
                </a>

                <a
                  href="https://www.twitch.tv/aquarivt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-purple-600 px-4 py-3 text-center font-bold transition hover:bg-purple-700"
                >
                  Twitch
                </a>

                <a
                  href="https://x.com/AtelierDia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-slate-700 px-4 py-3 text-center font-bold leading-6 transition hover:bg-slate-600"
                >
                  イラスト制作・Live2D制作者様
                  <br />
                  DIAさん
                </a>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <div className="mb-6 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold">配信スケジュール</h2>
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-200">
                  Weekly
                </span>
              </div>

              <div className="grid gap-4">
                {weeklySchedule.map((item) => (
                  <div
                    key={`${item.day}-${item.time}-${item.title}`}
                    className={`rounded-2xl border p-4 transition duration-300 hover:scale-[1.02] ${item.color}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold">{item.day}</h3>
                        <p className="mt-1 text-slate-200">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {item.note}
                        </p>
                      </div>

                      <p className="shrink-0 text-right text-lg font-black text-cyan-300">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-sm text-slate-400">
                ※スケジュールは変更になる場合があります。最新情報はXをご確認ください。
              </p>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">固定動画</h2>

              <a
                href={fixedVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-2xl border border-white/10"
              >
                <img
                  src={fixedThumbnail}
                  alt="Aquari 固定動画"
                  className="h-auto w-full object-cover transition duration-300 hover:scale-[1.02]"
                />
              </a>

              <a
                href={fixedVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-2xl bg-red-500 px-4 py-3 font-bold transition hover:bg-red-600"
              >
                YouTubeで見る
              </a>
            </section>
          </div>

          <div className="space-y-8">
            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h2 className="mb-6 text-2xl font-bold">ビジュアル</h2>

              <div className="grid gap-8 xl:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <h3 className="mb-4 text-lg font-semibold text-cyan-100">
                    バニー衣装
                  </h3>

                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <Image
                      src="/aquari-full.png"
                      alt="Aquari バニー衣装ビジュアル"
                      width={1200}
                      height={1200}
                      className="h-auto w-full object-cover transition duration-300 hover:scale-[1.02]"
                      priority
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <h3 className="mb-4 text-lg font-semibold text-cyan-100">
                    巫女衣装
                  </h3>

                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <Image
                      src="/aquari-shrine.png"
                      alt="Aquari 巫女衣装ビジュアル"
                      width={1200}
                      height={1200}
                      className="h-auto w-full object-cover transition duration-300 hover:scale-[1.02]"
                      priority
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-8 xl:grid-cols-2">
              <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-2xl font-bold">
                    {isLive ? "YouTube配信中" : "最新アーカイブ"}
                  </h2>

                  {isLive && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white shadow-lg">
                      <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
                      LIVE
                    </span>
                  )}
                </div>

                {loading ? (
                  <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-black/30 text-slate-300">
                    読み込み中...
                  </div>
                ) : youtubeDisplay ? (
                  <div className="space-y-4">
                    <a
                      href={youtubeDisplay.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-2xl border border-white/10"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${youtubeDisplay.id}/hqdefault.jpg`}
                        alt={youtubeDisplay.title}
                        className="h-auto w-full object-cover transition duration-300 hover:scale-[1.02]"
                      />
                    </a>

                    <a
                      href={youtubeDisplay.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sky-300 underline underline-offset-4 hover:text-sky-200"
                    >
                      {youtubeDisplay.title}
                    </a>

                    {!isLive && (
                      <p className="text-sm text-slate-400">
                        ※現在配信していないため、最新アーカイブを表示しています
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-black/20 p-4 text-slate-300">
                    動画が見つかりませんでした。
                  </div>
                )}
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
                <h2 className="mb-4 text-2xl font-bold">最新のShort動画</h2>

                {loading ? (
                  <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-black/30 text-slate-300">
                    読み込み中...
                  </div>
                ) : latest.latestShort ? (
                  <div className="space-y-4">
                    <a
                      href={latest.latestShort.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-2xl border border-white/10"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${latest.latestShort.id}/hqdefault.jpg`}
                        alt={latest.latestShort.title}
                        className="h-auto w-full object-cover transition duration-300 hover:scale-[1.02]"
                      />
                    </a>

                    <a
                      href={latest.latestShort.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sky-300 underline underline-offset-4 hover:text-sky-200"
                    >
                      {latest.latestShort.title}
                    </a>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-black/20 p-4 text-slate-300">
                    最新のShort動画が見つかりませんでした。
                  </div>
                )}
              </section>
            </div>

            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">Twitch配信</h2>

              {twitchSrc ? (
                <iframe
                  src={twitchSrc}
                  title="Aquari Twitch Live"
                  className="h-[360px] w-full rounded-2xl border border-white/10"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-[360px] items-center justify-center rounded-2xl bg-black/30 text-slate-300">
                  読み込み中...
                </div>
              )}
            </section>
          </div>
        </section>

        <footer className="mt-10 text-center text-slate-400">
          © Aquari
        </footer>
      </div>
    </main>
  );
}