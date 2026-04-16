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
  const fixedThumbnail = `https://img.youtube.com/vi/${fixedVideoId}/maxresdefault.jpg`;

  const bunnyVisuals: VisualItem[] = [
    { src: "/aquari-full.png", alt: "Aquari バニー衣装ビジュアル 1" },
    { src: "/aquari-full-2.png", alt: "Aquari バニー衣装ビジュアル 2" },
  ];

  const shrineVisuals: VisualItem[] = [
    { src: "/aquari-shrine.png", alt: "Aquari 巫女衣装ビジュアル 1" },
    { src: "/aquari-shrine-2.png", alt: "Aquari 巫女衣装ビジュアル 2" },
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
            神社に仕える狐巫女でありながら、人間に紛れて日々ゲーム配信を行っている。
            旅やサッカー観戦を好み、FPSを中心に活動中。
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">ビジュアル</h2>

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
          </div>

          <div className="space-y-8">
            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">固定動画</h2>

              <a
                href={fixedVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-2xl border border-white/10"
              >
                <Image
                  src={fixedThumbnail}
                  alt="Aquari 固定動画"
                  width={1280}
                  height={720}
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

            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">
                {latest.currentLive ? "配信中" : "最新アーカイブ"}
              </h2>

              {loading ? (
                <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-black/30 text-slate-300">
                  読み込み中...
                </div>
              ) : youtubeDisplay ? (
                <div className="space-y-4">
                  <iframe
                    className="aspect-video w-full rounded-2xl border border-white/10"
                    src={`https://www.youtube-nocookie.com/embed/${youtubeDisplay.id}`}
                    title={youtubeDisplay.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <a
                    href={youtubeDisplay.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sky-300 underline underline-offset-4 hover:text-sky-200"
                  >
                    {youtubeDisplay.title}
                  </a>
                </div>
              ) : (
                <div className="rounded-2xl bg-black/20 p-4 text-slate-300">
                  動画が見つかりませんでした。
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">Twitch配信</h2>

              {twitchSrc ? (
                <iframe
                  src={twitchSrc}
                  title="Aquari Twitch Live"
                  className="h-[320px] w-full rounded-2xl border border-white/10"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-[320px] items-center justify-center rounded-2xl bg-black/30 text-slate-300">
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