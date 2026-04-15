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
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="max-w-5xl mx-auto px-6 py-12">
        <section className="mb-10">
          <h1 className="text-5xl font-bold mb-4">Aquari</h1>
          <p className="text-lg text-gray-300 leading-8">
            神社に仕える狐巫女Vtuber。FPS配信や雑談を中心に活動中。
          </p>
        </section>

        <section className="mb-12">
          <div className="w-full max-w-4xl">
            <img
              src="/aquari-full.png"
              alt="Aquari character visual"
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>

          <p className="text-sm text-gray-400 mt-4">
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
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">YouTube配信</h2>
          <div className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-xl">
            <iframe
              className="w-full aspect-video"
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
            className="inline-block mt-4 rounded-lg bg-red-600 px-4 py-3 font-semibold hover:bg-red-500"
          >
            YouTubeチャンネルを見る
          </a>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Twitch配信</h2>
          <div className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-xl bg-black">
            {twitchSrc ? (
              <iframe
                src={twitchSrc}
                title="Aquari Twitch Stream"
                className="w-full"
                height="480"
                allowFullScreen
              />
            ) : (
              <div className="flex h-[480px] items-center justify-center text-gray-400">
                読み込み中...
              </div>
            )}
          </div>
          <a
            href="https://www.twitch.tv/aquarivt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 rounded-lg bg-purple-600 px-4 py-3 font-semibold hover:bg-purple-500"
          >
            Twitchチャンネルを見る
          </a>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">SNS / Links</h2>
          <div className="space-y-4 max-w-2xl">
            <a
              href="https://x.com/Aquari_Vt"
              target="_blank"
              rel="noopener noreferrer"8:08 2026/04/16 木曜日8:08 2026/04/16 木曜日8:08 2026/04/16 木曜日
              className="block rounded-xl bg-sky-600 px-5 py-4 font-semibold hover:bg-sky-500"
            >
              X（@Aquari_Vt）
            </a>

            <a
              href="https://www.youtube.com/channel/UCBvSY3MYEkkJ194_Zdjp2Jw"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl bg-red-600 px-5 py-4 font-semibold hover:bg-red-500"
            >
              YouTube
            </a>

            <a
              href="https://www.twitch.tv/aquarivt"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl bg-purple-600 px-5 py-4 font-semibold hover:bg-purple-500"
            >
              Twitch
            </a>

            <a
              href="https://x.com/AtelierDia"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl bg-slate-800 px-5 py-4 font-semibold hover:bg-slate-700"
            >
              制作者 DIAさん X
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}