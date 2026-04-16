"use client";

export default function Home() {
  return (
    <main className="min-h-screen text-white relative">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/aquari-bg.png')" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/70 backdrop-blur-sm" />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-3">Aquari</h1>
          <p className="text-gray-300">
            SIRIUS GAMING / 九尾系Vtuber
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <section className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
              <h2 className="text-xl font-bold mb-4">プロフィール</h2>
              <p className="text-gray-200 leading-8">
                SIRIUS GAMINGストリーマー部門所属の九尾系Vtuber。
                神社に仕える狐巫女でありながら、人間に紛れて日々ゲーム配信を行っている。
                旅やサッカー観戦を好み、PCゲームではFPSを中心に活動中。
              </p>
            </section>

            <section className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
              <h2 className="text-xl font-bold mb-4">タグ一覧</h2>
              <div className="space-y-2 text-gray-200">
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
                  ファンアート：
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
            </section>

            <section className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
              <h2 className="text-xl font-bold mb-4">SNS / Channel</h2>
              <div className="space-y-3">
                <a
                  href="https://x.com/Aquari_Vt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-sky-500 hover:bg-sky-600 p-3 rounded-lg text-center font-bold transition"
                >
                  X
                </a>

                <a
                  href="https://www.youtube.com/channel/UCBvSY3MYEkkJ194_Zdjp2Jw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-red-500 hover:bg-red-600 p-3 rounded-lg text-center font-bold transition"
                >
                  YouTube
                </a>

                <a
                  href="https://www.twitch.tv/aquarivt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-purple-600 hover:bg-purple-700 p-3 rounded-lg text-center font-bold transition"
                >
                  Twitch
                </a>

                <a
                  href="https://x.com/AtelierDia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center font-bold transition"
                >
                  DIAさん
                </a>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
              <h2 className="text-xl font-bold mb-4">固定動画</h2>
              <iframe
                className="w-full aspect-video rounded-xl"
                src="https://www.youtube.com/embed/HuQbQ9e4eJ8"
                title="YouTube video"
                allowFullScreen
              />
            </section>

            <section className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
              <h2 className="text-xl font-bold mb-4">YouTube配信</h2>
              <iframe
                className="w-full aspect-video rounded-xl"
                src="https://www.youtube.com/embed/live_stream?channel=UCBvSY3MYEkkJ194_Zdjp2Jw"
                title="YouTube Live"
                allowFullScreen
              />
              <p className="text-sm text-gray-400 mt-2">
                ※配信していない場合は表示されません
              </p>
            </section>
          </div>
        </div>

        <footer className="mt-16 text-center text-gray-400 text-sm">
          © Aquari
        </footer>
      </div>
    </main>
  );
}