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

type VisualItem = {
  src: string;
  alt: string;
};

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
　const fixedThumbnail = `https://img.youtube.com/vi/${fixedVideoId}/hqdefault.jpg;

  const bunnyVisuals: VisualItem[] = [
    { src: "/aquari-full.png", alt: "Aquari バニー衣装ビジュアル 1" },
  ];

  const shrineVisuals: VisualItem[] = [
    { src: "/aquari-shrine.png", alt: "Aquari 巫女衣装ビジュアル 1" },
  ];

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
        </header>

        <section className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">プロフィール</h2>
              <p className="leading-8 text-slate-200">
                SIRIUS GAMINGストリーマー部門所属の九尾系Vtuber。
                神社に仕える狐巫女でありながら、人間に紛れて日々ゲーム配信を行っている。
                旅やサッカー観戦を好み、PCゲームではFPSを中心に活動中。
              </p>
            </section>

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
                  className="rounded-2xl bg-slate-700 px-4 py-3 text-center font-bold transition hover:bg-slate-600"
                >
                  DIAさん
                </a>
              </div>
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

                  <div className="grid gap-4">
                    {bunnyVisuals.map((image, index) => (
                      <div
                        key={image.src}
                        className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          width={1200}
                          height={1200}
                          className="h-auto w-full object-cover transition duration-300 hover:scale-[1.02]"
                          priority={index === 0}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <h3 className="mb-4 text-lg font-semibold text-cyan-100">
                    巫女衣装
                  </h3>

                  <div className="grid gap-4">
                    {shrineVisuals.map((image, index) => (
                      <div
                        key={image.src}
                        className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          width={1200}
                          height={1200}
                          className="h-auto w-full object-cover transition duration-300 hover:scale-[1.02]"
                          priority={index === 0}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

<section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
  <h2 className="mb-4 text-2xl font-bold">
    {latest.currentLive ? "YouTube配信中" : "最新アーカイブ"}
  </h2>

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
          src={youtubeDisplay.thumbnail}
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

      {!latest.currentLive && (
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
                      <Image
                        src={latest.latestShort.thumbnail}
                        alt={latest.latestShort.title}
                        width={1280}
                        height={720}
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
            </section>

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