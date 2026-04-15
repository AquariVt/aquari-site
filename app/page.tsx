"use client";

import { useEffect, useState } from "react";

export default function AquariHomepage() {
  const [twitchSrc, setTwitchSrc] = useState("");

  useEffect(() => {
    const hostname = window.location.hostname || "localhost";
    setTwitchSrc(
      `https://player.twitch.tv/?channel=aquarivt&parent=${hostname}`
    );
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/aquari-bg.png')" }}
      />
      <div className="absolute inset-0 bg-slate-950/75" />

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
        <section className="mb-12 rounded-3xl border border-white/10 bg-black/30 p-6 shadow-2xl backdrop-blur-md md:p-10">
          <div className="max-w-3xl">
            <p className="mb-3 inline-block rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
              Vtuber / Streamer
            </p>
            <h1 className="mb-4 text-5xl font-black tracking-tight md:text-7xl">
              Aquari
            </h1>
            <p className="text-base leading-8 text-slate-200 md:text-xl">
              神社に仕える狐巫女Vtuber。FPS配信や雑談を中心に活動中。
              YouTubeとTwitchで配信しながら、気軽に楽しめる場所を届けています。
            </p>
          </div>
        </section>

        <section className="mb-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-black/35 p-5 shadow-2xl backdrop-blur-md">
            <img
              src="/aquari-full.png"
              alt="Aquari character visual"
              className="w-full rounded-2xl object-cover"
            />
            <p className="mt-4 text-sm text-slate-300">
              イラスト制作：
              <a
                href="https://x.com/AtelierDia"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-sky-400 underline underline-offset-4 hover:text-sky-300"
              >
                DIA（@AtelierDia）
              </a>
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-black/35 p-6 shadow-2xl backdrop-blur-md">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
                Profile
              </p>
              <h2 className="mt-3 text-3xl font-bold">Aquariについて</h2>
              <p className="mt-4 leading-8 text-slate-200">
                狐巫女の世界観をベースに活動するVtuber。
                FPSを中心に、雑談や参加型配信も行っています。
                青を基調にしたビジュアルと、やわらかい雰囲気の配信が特徴です。
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/35 p-6 shadow-2xl backdrop-blur-md">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
                Links
              </p>
              <h2 className="mt-3 text-3xl font-bold">SNS / Channel</h2>
              <div className="mt-5 space-y-4">
                <a
                  href="https://x.com/Aquari_Vt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl bg-sky-600 px-5 py-4 font-semibold transition hover:bg-sky-500"
                >
                  X（@Aquari_Vt）
                </a>

                <a
                  href="https://www.youtube.com/channel/UCBvSY3MYEkkJ194_Zdjp2Jw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl bg-red-600 px-5 py-4 font-semibold transition hover:bg-red-500"
                >
                  YouTube
                </a>

                <a
                  href="https://www.twitch.tv/aquarivt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl bg-purple-600 px-5 py-4 font-semibold transition hover:bg-purple-500"
                >
                  Twitch
                </a>

                <a
                  href="https://x.com/AtelierDia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl bg-slate-800 px-5 py-4 font-semibold transition hover:bg-slate-700"
                >
                  制作者 DIAさん X
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 rounded-3xl border border-white/10 bg-black/35 p-6 shadow-2xl backdrop-blur-md md:p-8">
          <h2 className="mb-5 text-3xl font-bold">YouTube配信</h2>
          <div className="overflow-hidden rounded-2xl shadow-xl">
            <iframe
              className="aspect-video w-full"
              src="https://www.youtube.com/embed/live_stream?channel=UCBvSY3MYEkkJ194_Zdjp2Jw"
              title="Aquari YouTube Live"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <a
            href="https://www.youtube.com/channel/UCBvSY3MYEkkJ194_Zdjp2Jw"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500"
          >
            YouTubeチャンネルを見る
          </a>
        </section>

        <section className="mb-12 rounded-3xl border border-white/10 bg-black/35 p-6 shadow-2xl backdrop-blur-md md:p-8">
          <h2 className="mb-5 text-3xl font-bold">Twitch配信</h2>
          <div className="overflow-hidden rounded-2xl bg-black shadow-xl">
            {twitchSrc ? (
              <iframe
                src={twitchSrc}
                title="Aquari Twitch Stream"
                className="w-full"
                height="480"
                allowFullScreen
              />
            ) : (
              <div className="flex h-[480px] items-center justify-center text-slate-400">
                読み込み中...
              </div>
            )}
          </div>
          <a
            href="https://www.twitch.tv/aquarivt"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-xl bg-purple-600 px-5 py-3 font-semibold transition hover:bg-purple-500"
          >
            Twitchチャンネルを見る
          </a>
        </section>
      </main>
    </div>
  );
}