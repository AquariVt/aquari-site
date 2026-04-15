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

      {/* 背景画像（調整済み） */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/aquari-bg.png')" }}
      />

      {/* 暗くするオーバーレイ */}
      <div className="absolute inset-0 bg-slate-950/70" />

      {/* 本体 */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">

        {/* タイトル */}
        <section className="mb-10">
          <h1 className="text-5xl font-bold mb-4">Aquari</h1>
          <p className="text-gray-300">
            神社に仕える狐巫女Vtuber。FPS配信や雑談を中心に活動中。
          </p>
        </section>

        {/* プロフィール + 画像 */}
        <section className="grid gap-8 lg:grid-cols-2 mb-12">

          {/* 立ち絵 */}
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
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

          {/* プロフィール */}
          <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-bold mb-4">Aquariについて</h2>
            <p className="text-gray-300 leading-7">
              狐巫女の世界観をベースに活動するVtuber。
              FPSを中心に雑談や参加型配信も行っています。
              青を基調にしたビジュアルと、やわらかい雰囲気の配信が特徴です。
            </p>
          </div>
        </section>

        {/* SNS */}
        <section className="mb-12 bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold mb-4">SNS / Channel</h2>

          <div className="space-y-4">
            <a
              href="https://x.com/Aquari_Vt"
              target="_blank"
              className="block bg-sky-600 p-4 rounded-xl"
            >
              X（@Aquari_Vt）
            </a>

            <a
              href="https://www.youtube.com/channel/UCBvSY3MYEkkJ194_Zdjp2Jw"
              target="_blank"
              className="block bg-red-600 p-4 rounded-xl"
            >
              YouTube
            </a>

            <a
              href="https://www.twitch.tv/aquarivt"
              target="_blank"
              className="block bg-purple-600 p-4 rounded-xl"
            >
              Twitch
            </a>

            <a
              href="https://x.com/AtelierDia"
              target="_blank"
              className="block bg-gray-700 p-4 rounded-xl"
            >
              制作者 DIAさん X
            </a>
          </div>
        </section>

        {/* YouTube埋め込み */}
        <section className="mb-12 bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold mb-4">YouTube配信</h2>

          <iframe
            className="w-full aspect-video rounded-xl"
            src="https://www.youtube.com/embed/live_stream?channel=UCBvSY3MYEkkJ194_Zdjp2Jw"
            allowFullScreen
          />
        </section>

        {/* Twitch埋め込み */}
        <section className="mb-12 bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold mb-4">Twitch配信</h2>

          {twitchSrc && (
            <iframe
              src={twitchSrc}
              height="400"
              width="100%"
              allowFullScreen
            />
          )}
        </section>

      </main>
    </div>
  );
}