"use client";

export default function Home() {
  return (
    <main className="min-h-screen text-white relative">

      {/* 背景 */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/aquari-bg.png')" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/70 backdrop-blur-sm" />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ヘッダー */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-3">Aquari</h1>
          <p className="text-gray-300">
            神社に仕える狐巫女Vtuber / FPSメイン配信
          </p>
        </header>

        {/* グリッド */}
        <div className="grid gap-8 lg:grid-cols-2">

          {/* 左カラム */}
          <div className="space-y-8">

            {/* プロフィール */}
            <section className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
              <h2 className="text-xl font-bold mb-3">プロフィール</h2>
              <p className="text-gray-200 leading-7">
                神社に仕える狐巫女Vtuber。人間に紛れてゲーム配信を行っている。
                FPSを中心に活動中。
              </p>
            </section>

            {/* タグ */}
            <section className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
              <h2 className="text-xl font-bold mb-4">タグ一覧</h2>

              <div className="space-y-2 text-gray-200">
                <p>#Aquari配信</p>
                <p>#アクエリ水族館</p>
                <p>#アクエリアート</p>
                <p>#アクエリ飲んだ</p>
              </div>
            </section>

            {/* SNS */}
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

          {/* 右カラム */}
          <div className="space-y-8">

            {/* 固定動画 */}
            <section className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
              <h2 className="text-xl font-bold mb-4">固定動画</h2>

              <iframe
                className="w-full aspect-video rounded-xl"
                src="https://www.youtube.com/embed/HuQbQ9e4eJ8"
                title="YouTube video"
                allowFullScreen
              />
            </section>

            {/* 配信 */}
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

        {/* フッター */}
        <footer className="mt-16 text-center text-gray-400 text-sm">
          © Aquari / 制作者 DIA
        </footer>

      </div>
    </main>
  );
}