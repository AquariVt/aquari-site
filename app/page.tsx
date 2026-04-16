"use client";

import { useEffect, useState } from "react";

type VideoItem = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
};

type LatestResponse = {
  latestShort: VideoItem | null;
  latestArchive: VideoItem | null;
};

export default function Home() {
  const [twitchSrc, setTwitchSrc] = useState("");
  const [latest, setLatest] = useState<LatestResponse>({
    latestShort: null,
    latestArchive: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const host = window.location.hostname || "localhost";
    setTwitchSrc(`https://player.twitch.tv/?channel=aquarivt&parent=${host}`);

    const loadLatest = async () => {
      try {
        const res = await fetch("/api/youtube/latest", { cache: "no-store" });
        if (!res.ok) throw new Error("failed to fetch latest videos");
        const data: LatestResponse = await res.json();
        setLatest(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadLatest();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/aquari-bg.png')" }}
      />
      <div className="fixed inset-0 -z-10 bg-slate-950/75 backdrop-blur-[2px]" />

      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
        <header className="mb-10 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md md:p-10">
          <div className="inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
            SIRIUS GAMING / 九尾系Vtuber
          </div>

          <h1 className="mt-5 text-5xl font-black tracking-tight md:text-7xl">
            Aquari
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200 md:text-lg">
            SIRIUS GAMINGストリーマー部門所属の九尾系Vtuber。
            神社に仕える狐巫女でありながら、人間に紛れて日々ゲーム配信を行っている。
            旅やサッカー観戦を好み、PCゲームではFPSを中心に活動中。
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">プロフィール</h2>
              <p className="leading-8 text-slate-200">
                SIRIUS GAMINGストリーマー部門所属の九尾系Vtuber。
                神社に仕える狐巫女でありながら、人間に紛れて日々ゲーム配信を行っている。
                旅やサッカー観戦を好み、PCゲームではFPSを中心に活動中。
              </p>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">タグ一覧</h2>

              <div className="space-y-3 text-slate-200">
                <p>配信（切り抜きも）：<a href="https://x.com/search?q=%23Aquari%E9%85%8D%E4%BF%A1&src=typed_query" target="_blank" rel="noopener noreferrer" className="ml-2 text-sky-400 underline underline-offset-4 hover:text-sky-300">#Aquari配信</a></p>
                <p>エゴサ：<a href="https://x.com/search?q=%23%E3%82%A2%E3%82%AF%E3%82%A8%E3%83%AA%E6%B0%B4%E6%97%8F%E9%A4%A8&src=typed_query" target="_blank" rel="noopener noreferrer" className="ml-2 text-sky-400 underline underline-offset-4 hover:text-sky-300">#アクエリ水族館</a></p>
                <p>ファンアート：<a href="https://x.com/search?q=%23%E3%82%A2%E3%82%AF%E3%82%A8%E3%83%AA%E3%82%A2%E3%83%BC%E3%83%88&src=typed_query" target="_blank" rel="noopener noreferrer" className="ml-2 text-sky-400 underline underline-offset-4 hover:text-sky-300">#アクエリアート</a></p>
                <p>R18FA用：<a href="https://x.com/search?q=%23%E3%82%A2%E3%82%AF%E3%82%A8%E3%83%AA%E9%A3%B2%E3%82%93%E3%81%A0&src=typed_query" target="_blank" rel="noopener noreferrer" className="ml-2 text-sky-400 underline underline-offset-4 hover:text-sky-300">#アクエリ飲んだ</a></p>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">SNS / Channel</h2>

              <div className="grid gap-3">
                <a href="https://x.com/Aquari_Vt" target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-sky-500 px-4 py-3 text-center font-bold transition hover:bg-sky-600">X</a>
                <a href="https://www.youtube.com/channel/UCBvSY3MYEkkJ194_Zdjp2Jw" target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-red-500 px-4 py-3 text-center font-bold transition hover:bg-red-600">YouTube</a>
                <a href="https://www.twitch.tv/aquarivt" target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-purple-600 px-4 py-3 text-center font-bold transition hover:bg-purple-700">Twitch</a>
                <a href="https://x.com/AtelierDia" target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-slate-700 px-4 py-3 text-center font-bold transition hover:bg-slate-600">DIAさん</a>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">メインビジュアル</h2>
              <img src="/aquari-full.png" alt="Aquari main visual" className="w-full rounded-2xl shadow-xl" />
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">別衣装ビジュアル</h2>
              <img src="/aquari-shrine.png" alt="Aquari shrine visual" className="w-full rounded-2xl shadow-xl" />
            </section>
          </div>

          <div className="space-y-8">
            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">固定動画</h2>
              <iframe
                className="aspect-video w-full rounded-2xl"
                src="https://www.youtube.com/embed/HuQbQ9e4eJ8"
                title="Aquari fixed video"
                allowFullScreen
              />
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">YouTube配信</h2>
              <iframe
                className="aspect-video w-full rounded-2xl"
                src="https://www.youtube.com/embed/live_stream?channel=UCBvSY3MYEkkJ194_Zdjp2Jw"
                title="Aquari YouTube Live"
                allowFullScreen
              />
              <p className="mt-2 text-sm text-slate-400">
                ※配信していない場合は表示されません
              </p>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">Twitch配信</h2>
              {twitchSrc ? (
                <iframe
                  src={twitchSrc}
                  title="Aquari Twitch Live"
                  className="w-full rounded-2xl"
                  height="320"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-[320px] items-center justify-center rounded-2xl bg-black/30 text-slate-300">
                  読み込み中...
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">最新のShort動画</h2>
              {loading ? (
                <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-black/30 text-slate-300">
                  読み込み中...
                </div>
              ) : latest.latestShort ? (
                <div className="space-y-4">
                  <iframe
                    className="aspect-video w-full rounded-2xl"
                    src={`https://www.youtube.com/embed/${latest.latestShort.id}`}
                    title={latest.latestShort.title}
                    allowFullScreen
                  />
                  <a
                    href={latest.latestShort.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sky-400 underline underline-offset-4 hover:text-sky-300"
                  >
                    {latest.latestShort.title}
                  </a>
                </div>
              ) : (
                <p className="text-slate-300">最新のShort動画が見つかりませんでした。</p>
              )}
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">最新のアーカイブ</h2>
              {loading ? (
                <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-black/30 text-slate-300">
                  読み込み中...
                </div>
              ) : latest.latestArchive ? (
                <div className="space-y-4">
                  <iframe
                    className="aspect-video w-full rounded-2xl"
                    src={`https://www.youtube.com/embed/${latest.latestArchive.id}`}
                    title={latest.latestArchive.title}
                    allowFullScreen
                  />
                  <a
                    href={latest.latestArchive.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sky-400 underline underline-offset-4 hover:text-sky-300"
                  >
                    {latest.latestArchive.title}
                  </a>
                </div>
              ) : (
                <p className="text-slate-300">最新のアーカイブが見つかりませんでした。</p>
              )}
            </section>
          </div>
        </section>

        <footer className="mt-14 text-center text-sm text-slate-400">
          © Aquari
        </footer>
      </div>
    </main>
  );
}