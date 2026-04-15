export default function AquariHomepage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* タイトル */}
        <h1 className="text-5xl font-bold mb-4">Aquari</h1>

        {/* 説明 */}
        <p className="text-lg text-gray-300 mb-8">
          神社に仕える狐巫女Vtuber。FPS配信や雑談を中心に活動中。
        </p>

        {/* 立ち絵 */}
        <div className="w-full max-w-md mb-10">
          <img
            src="/aquari.png"
            alt="Aquari"
            className="rounded-xl w-full"
          />
        </div>

        {/* YouTube */}
        <h2 className="text-2xl font-bold mt-10 mb-4">YouTube配信</h2>

        <div className="w-full max-w-3xl mb-10">
          <iframe
            className="w-full aspect-video rounded-xl"
            src="https://www.youtube.com/embed/live_stream?channel=UCBvSY3MYEkkJ194_Zdjp2Jw"
            title="YouTube live"
            allowFullScreen
          ></iframe>
        </div>

        {/* Twitch */}
        <h2 className="text-2xl font-bold mb-4">Twitch配信</h2>

        <div className="w-full max-w-3xl mb-10">
          <iframe
            src="https://player.twitch.tv/?channel=aquarivt&parent=aquari-site.vercel.app"
            height="400"
            width="100%"
            allowFullScreen
          ></iframe>
        </div>

        {/* SNS */}
        <h2 className="text-2xl font-bold mt-10 mb-4">SNS</h2>

        <div className="space-y-4">
          <a
            href="https://x.com/Aquari_Vt"
            className="block bg-blue-500 px-4 py-3 rounded-lg"
          >
            X（Twitter）
          </a>

          <a
            href="https://www.youtube.com/channel/UCBvSY3MYEkkJ194_Zdjp2Jw"
            className="block bg-red-500 px-4 py-3 rounded-lg"
          >
            YouTube
          </a>

          <a
            href="https://www.twitch.tv/aquarivt"
            className="block bg-purple-500 px-4 py-3 rounded-lg"
          >
            Twitch
          </a>
        </div>

      </main>
    </div>
  );
}