"use client";

export default function Home() {
  return (
    <main className="min-h-screen text-white bg-black">
      
      {/* 背景 */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/aquari-bg.png')" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/60" />

      <div className="mx-auto max-w-5xl px-6 py-10">

        {/* タイトル */}
        <h1 className="text-5xl font-bold mb-6">Aquari</h1>

        {/* プロフィール */}
        <section className="mb-10">
          <p className="text-gray-200 leading-7">
            神社に仕える狐巫女Vtuber。FPS中心に活動中。
          </p>
        </section>

        {/* タグ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">タグ一覧</h2>

          <div className="space-y-2">
            <p>#Aquari配信</p>
            <p>#アクエリ水族館</p>
            <p>#アクエリアート</p>
            <p>#アクエリ飲んだ</p>
          </div>
        </section>

        {/* SNS */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">SNS</h2>

          <div className="space-y-3">
            <a
              href="https://x.com/Aquari_Vt"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-sky-500 p-3 rounded text-center font-bold"
            >
              X
            </a>

            <a
              href="https://www.youtube.com/channel/UCBvSY3MYEkkJ194_Zdjp2Jw"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-red-500 p-3 rounded text-center font-bold"
            >
              YouTube
            </a>

            <a
              href="https://www.twitch.tv/aquarivt"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-purple-600 p-3 rounded text-center font-bold"
            >
              Twitch
            </a>

            {/* ★ここが修正ポイント */}
            <a
              href="https://x.com/AtelierDia"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-700 p-3 rounded text-center font-bold"
            >
              DIAさん
            </a>
          </div>
        </section>

        {/* YouTube固定動画 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">固定動画</h2>

          <iframe
            className="w-full aspect-video rounded"
            src="https://www.youtube.com/embed/HuQbQ9e4eJ8"
            title="YouTube video"
            allowFullScreen
          />
        </section>

        {/* YouTube配信 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">YouTube配信</h2>

          <iframe
            className="w-full aspect-video rounded"
            src="https://www.youtube.com/embed/live_stream?channel=UCBvSY3MYEkkJ194_Zdjp2Jw"
            title="YouTube live"
            allowFullScreen
          />
        </section>

      </div>
    </main>
  );
}