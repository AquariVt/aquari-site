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
    <div className="relative min-h-screen overflow-hidden text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/aquari-bg.png')" }}
      />
      <div className="absolute inset-0 bg-slate-950/70" />

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <section className="mb-10">
          <h1 className="mb-4 text-5xl font-bold">Aquari</h1>
          <p className="text-gray-300">
            神社に仕える狐巫女Vtuber。FPS配信や雑談を中心に活動中。
          </p>
        </section>

        <section className="mb-12 grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
              <img
                src="/aquari-full.jpg"
                alt="Aquari character visual"
                className="w-full rounded-xl"
              />
              <p className="mt-4 text-sm text-gray-300">
                イラスト制作：
                <a
                  href="https://x.com/AtelierDia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-sky-400 underline"
                >
                  DIA（@AtelierDia）
                </a>
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
              <img
                src="/aquari-shrine.png"
                alt="Aquari shrine outfit visual"
                className="w-full rounded-xl"
              />
              <p className="mt-4 text-sm text-gray-300">
                別衣装ビジュアル
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">Aquariについて</h2>
              <p className="text-gray-300 leading-7">
                狐巫女の世界観をベースに活動するVtuber。
                FPSを中心に雑談や参加型配信も行っています。
                青を基調にしたビジュアルと、やわらかい雰囲気の配信が特徴です。
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">SNS / Channel</h2>
              <div className="space-y-4">
                <a
                  href="https://x.com/Aquari_Vt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl bg-sky-600 p-4"
                >
                  X（@Aquari_Vt）
                </a>

                <a
                  href="https://www.youtube.com/channel/UCBvSY3MYEkkJ194_Zdjp2Jw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl bg-red-600 p-4"
                >
                  YouTube
                </a>

                <a
                  href="https://www.twitch.tv/aquarivt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl bg-purple-600 p-4"
                >
                  Twitch
                </a>

                <a
                  href="https://x.com/AtelierDia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl bg-gray-700 p-4"
                >
                  制作者 DIAさん X
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
          <h2 className="mb-4 text-2xl font-bold">YouTube配信</h2>
          <iframe
            className="aspect-video w-full rounded-xl"
            src="https://www.youtube.com/embed/live_stream?channel=UCBvSY3MYEkkJ194_Zdjp2Jw"
            title="Aquari YouTube Live"
            allowFullScreen
          />
        </section>

        <section className="mb-12 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
          <h2 className="mb-4 text-2xl font-bold">Twitch配信</h2>
          {twitchSrc && (
            <iframe
              src={twitchSrc}
              title="Aquari Twitch Stream"
              height="400"
              width="100%"
              allowFullScreen
              className="rounded-xl"
            />
          )}
        </section>
      </main>
    </div>
  );
}