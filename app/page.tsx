"use client";

export default function Home() {
  return (
    <main className="min-h-screen text-white relative">

      {/* 背景 */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/aquari-bg.png')" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/70" />

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* タイトル */}
        <h1 className="text-5xl font-bold mb-6">Aquari</h1>

        {/* プロフィール */}
        <p className="mb-8 text-gray-200">
          神社に仕える狐巫女Vtuber。FPS中心に活動中。
        </p>

        {/* タグ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">タグ一覧</h2>
          <div className="space-y-1 text-gray-200">
            <p>#Aquari配信</p>
            <p>#アクエリ水族館</p>
            <p>#アクエリアート</p>
            <p>#アクエリ飲んだ</p>
          </div>
        </section>

        {/* SNS */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">SNS</h2>

          <div className="space-y-3">
            <a href="https://x.com/Aquari_Vt" target="_blank" rel="noopener noreferrer"
              className="block bg-sky-500 p-3 rounded text-center font-bold">X</a>

            <a href="https://www.youtube.com/channel/UCBvSY3MYEkkJ194_Zdjp2Jw" target="_blank" rel="noopener noreferrer"
              className="block bg-red-500 p-3 rounded text-center font-bold">YouTube</a>

            <a href="https://www.twitch.tv/aquarivt" target="_blank" rel="noopener noreferrer"
              className="block bg-purple-600 p-3 rounded text-center font-bold">Twitch</a>

            {/* ← 修正済み */}
            <a href="https://x.com/AtelierDia" target="_blank" rel="noopener noreferrer"
              className="block bg-gray-700 p-3 rounded text-center font-bold">
              DIAさん
            </a>
          </div>
        </section>

        {/* 固定動画 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">固定動画</h2>
          <iframe
            className="w-full aspect-video rounded"
            src="https://www.youtube.com/embed/HuQbQ9e4eJ8"
            allowFullScreen
          />
        </section>

        {/* 配信 */}
        <section>
          <h2 className="text-xl font-bold mb-3">YouTube配信</h2>

          {/* ⚠️ここ修正ポイント */}
          <iframe
            className="w-full aspect-video rounded"
            src="https://www.youtube.com/embed/live_stream?channel=UCBvSY3MYEkkJ194_Zdjp2Jw"
            allowFullScreen
          />
        </section>

      </div>
    </main>
  );
}