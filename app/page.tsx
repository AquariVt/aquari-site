"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [twitchSrc, setTwitchSrc] = useState("");

  useEffect(() => {
    const hostname = window.location.hostname || "localhost";
    setTwitchSrc(
      `https://player.twitch.tv/?channel=aquarivt&parent=${hostname}`
    );
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/aquari-bg.png')" }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <section className="mb-10">
          <p className="mb-3 inline-block rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
            SIRIUS GAMING / 九尾系Vtuber
          </p>

          <h1 className="mb-4 text-5xl font-bold drop-shadow-lg md:text-6xl">
            Aquari
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-gray-200">
            神社に仕える狐巫女Vtuber。人間に紛れてゲーム配信をしながら、
            FPSを中心に活動中。
          </p>
        </section>

        <section className="mb-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-lg">
              <img
                src="/aquari-full.png"
                alt="Aquari main visual"
                className="w-full rounded-xl shadow-xl"
              />

              <div className="mt-6 rounded-xl bg-black/30 p-4 text-sm text-gray-200">
                <p className="mb-2 font-bold text-white">制作者クレジット</p>
                <p>
                  イラスト制作：
                  <a
                    href="https://x.com/AtelierDia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sky-400 underline underline-offset-4 hover:text-sky-300"
                  >
                    DIA（@AtelierDia）
                  </a>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-lg">
              <img
                src="/aquari-shrine.png"
                alt="Aquari shrine visual"
                className="w-full rounded-xl shadow-xl"
              />
              <p className="mt-4 text-sm text-gray-200">別衣装ビジュアル</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-lg">
              <h2 className="mb-4 text-2xl font-bold">Aquariについて</h2>

              <p className="text-gray-200 leading-8">
                SIRIUS GAMINGストリーマー部門所属の九尾系Vtuber。
                神社に仕える狐巫女でありながら、人間に紛れて日々ゲーム配信を行っている。
                旅やサッカー観戦を好み、PCゲームではFPSを中心に活動中。
              </p>

              <div className="mt-8">
                <h3 className="mb-4 text-xl font-bold">タグ一覧</h3>

                <div className="space-y-3 text-gray-200">
                  <p>
                    配信（切り抜きも）：
                    <a
                      href="https://x.com/search?q=%23Aquari%E9%85%8D%E4%BF%A1&src=typed_query"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-sky-400 underline underline-offset-4 hover:text-sky-300"
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
                      className="ml-2 text-sky-400 underline underline-offset-4 hover:text-sky-300"
                    >
                      #アクエリ水族館
                    </a>
                  </p>

                  <p>
                    ファンアートタグ：
                    <a
                      href="https://x.com/search?q=%23%E3%82%A2%E3%82%AF%E3%82%A8%E3%83%AA%E3%82%A2%E3%83%BC%E3%83%88&src=typed_query"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-sky-400 underline underline-offset-4 hover:text-sky-300"
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
                      className="ml-2 text-sky-400 underline underline-offset-4 hover:text-sky-300"
                    >
                      #アクエリ飲んだ
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-lg">
              <h2 className="mb-4 text-2xl font-bold">SNS / Channel</h2>

              <div className="space-y-4">
                <a
                  href="https://x.com/Aquari_Vt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className