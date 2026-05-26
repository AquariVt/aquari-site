import Link from "next/link";

type Achievement = {
  date: string;
  tournament: string;
  result: string;
  game: string;
  note?: string;
  image?: string;
};

const achievements: Achievement[] = [
  {
    date: "2026年",
    tournament: "AREND CUP",
    result: "総合3位",
    game: "Apex Legends",
    note: "大会結果画像を掲載しています。",
    image: "/arend-cup.png",
  },
];

export default function AchievementsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/aquari-bg.png')" }}
      />
      <div className="fixed inset-0 -z-10 bg-slate-950/80 backdrop-blur-[3px]" />

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <header className="mb-8 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md md:p-10">
          <Link
            href="/"
            className="mb-5 inline-block text-sm text-sky-300 underline underline-offset-4 hover:text-sky-200"
          >
            ← トップへ戻る
          </Link>

          <h1 className="text-4xl font-black md:text-6xl">大会実績</h1>

          <p className="mt-4 leading-8 text-slate-200">
            Aquariの大会参加実績・成績一覧です。
          </p>
        </header>

        <section className="space-y-6">
          {achievements.map((item) => (
            <article
              key={`${item.date}-${item.tournament}`}
              className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md"
            >
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-sky-500/20 px-3 py-1 text-sm font-bold text-sky-200">
                  {item.date}
                </span>

                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm font-bold text-purple-200">
                  {item.game}
                </span>

                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-sm font-bold text-amber-200">
                  {item.result}
                </span>
              </div>

              <h2 className="text-2xl font-bold md:text-3xl">
                {item.tournament}
              </h2>

              {item.note && (
                <p className="mt-3 leading-7 text-slate-300">{item.note}</p>
              )}

              {item.image && (
                <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-xl">
                  <img
                    src={item.image}
                    alt={`${item.tournament} 大会結果`}
                    className="w-full object-cover"
                  />
                </div>
              )}
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}