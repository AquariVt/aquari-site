export default function AquariHomepage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* タイトル */}
        <h1 className="text-5xl font-bold mb-6">Aquari</h1>

        {/* 説明 */}
        <p className="text-lg text-gray-300 mb-10">
          神社に仕える狐巫女Vtuber。FPS配信や雑談を中心に活動中。
        </p>

        {/* 画像 */}
        <div className="w-full max-w-md mb-10">
        <img
  src="/aquari.png"
  alt="Aquari"
  className="rounded-xl w-full"
/>
        </div>

        {/* SNS */}
        <div className="space-y-4">
          <a
            href="https://x.com/Aquari_Vt"
            className="block bg-blue-500 px-4 py-3 rounded-lg"
          >
            X（Twitter）
          </a>

          <a
            href="https://m.twitch.tv/aquarivt/home"
            className="block bg-purple-500 px-4 py-3 rounded-lg"
          >
            Twitch
          </a>
        </div>

      </main>
    </div>
  );
}