"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";

type VideoItem = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  embeddable: boolean;
  publishedAt?: string | null;
};

type SectionName = "live" | "archive" | "shorts" | "video";
type SectionState = {
  status: "ok" | "stale" | "error" | "unconfigured";
  checkedAt: string | null;
};
type LatestResponse = {
  latestShort: VideoItem | null;
  latestVideo: VideoItem | null;
  latestArchive: VideoItem | null;
  currentLive: VideoItem | null;
  sections: Record<SectionName, SectionState>;
};

const CHANNEL_URL = "https://www.youtube.com/channel/UCBvSY3MYEkkJ194_Zdjp2Jw";
const SHORTS_URL = `${CHANNEL_URL}/shorts`;
// The hostname cannot change without navigation. Use an empty server snapshot for hydration.
const subscribeToHostname = () => () => {};
const getHostname = () => window.location.hostname;
const getServerHostname = () => "";
const emptyLatest: LatestResponse = {
  latestShort: null, latestArchive: null, currentLive: null, latestVideo: null,
  sections: {
    live: { status: "error", checkedAt: null },
    archive: { status: "error", checkedAt: null },
    shorts: { status: "error", checkedAt: null },
    video: { status: "error", checkedAt: null },
  },
};

function readVideo(value: unknown, shorts = false): VideoItem | null {
  if (value === null) return null;
  if (!value || typeof value !== "object") throw new Error("invalid_video");
  const item = value as Record<string, unknown>;
  if (typeof item.id !== "string" || !/^[A-Za-z0-9_-]{11}$/.test(item.id)
    || typeof item.title !== "string" || typeof item.embeddable !== "boolean") {
    throw new Error("invalid_video");
  }
  let thumbnail = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`;
  if (typeof item.thumbnail === "string") {
    try {
      const url = new URL(item.thumbnail);
      if (url.protocol === "https:" && ["i.ytimg.com", "img.youtube.com"].includes(url.hostname)) {
        thumbnail = url.href;
      }
    } catch { /* Use the fixed-domain fallback. */ }
  }
  return {
    id: item.id, title: item.title, thumbnail, embeddable: item.embeddable,
    publishedAt: typeof item.publishedAt === "string" && Number.isFinite(Date.parse(item.publishedAt)) ? item.publishedAt : null,
    // Construct links ourselves instead of accepting arbitrary API-provided URLs.
    url: shorts ? `https://www.youtube.com/shorts/${item.id}` : `https://www.youtube.com/watch?v=${item.id}`,
  };
}

function readLatest(value: unknown): LatestResponse {
  if (!value || typeof value !== "object") throw new Error("invalid_response");
  const data = value as Record<string, unknown>;
  if (!data.sections || typeof data.sections !== "object") throw new Error("invalid_sections");
  const sections = {} as Record<SectionName, SectionState>;
  for (const name of ["live", "archive", "shorts", "video"] as const) {
    const section = (data.sections as Record<string, unknown>)[name];
    if (!section || typeof section !== "object") throw new Error("invalid_section");
    const state = section as Record<string, unknown>;
    if (!["ok", "stale", "error", "unconfigured"].includes(String(state.status))
      || !(state.checkedAt === null || (typeof state.checkedAt === "string" && Number.isFinite(Date.parse(state.checkedAt))))) {
      throw new Error("invalid_section");
    }
    sections[name] = { status: state.status as SectionState["status"], checkedAt: state.checkedAt as string | null };
  }
  return {
    currentLive: readVideo(data.currentLive), latestArchive: readVideo(data.latestArchive),
    latestShort: readVideo(data.latestShort, true), latestVideo: readVideo(data.latestVideo), sections,
  };
}

function mergeLatest(previous: LatestResponse, incoming: LatestResponse): LatestResponse {
  const next = { ...incoming, sections: { ...incoming.sections } };
  for (const [section, key] of [["archive", "latestArchive"], ["shorts", "latestShort"], ["video", "latestVideo"]] as const) {
    if (incoming.sections[section].status === "error" && previous[key]) {
      const checkedAt = previous.sections[section].checkedAt;
      if (checkedAt && Date.now() - Date.parse(checkedAt) < 7 * 86400 * 1000) {
        next[key] = previous[key];
        next.sections[section] = { status: "stale", checkedAt };
      }
    }
  }
  // An unverified previous live stream must not keep a LIVE badge.
  if (incoming.sections.live.status !== "ok") next.currentLive = null;
  return next;
}

function VideoThumbnail({ video }: { video: VideoItem }) {
  const [attempt, setAttempt] = useState(0);
  const sources = [...new Set([video.thumbnail, `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`])];
  if (attempt >= sources.length) return <div className="flex aspect-video items-center justify-center bg-black/30 text-sky-200">YouTubeで見る ↗</div>;
  return <div className="relative aspect-video w-full bg-black/30">
    <Image key={sources[attempt]} src={sources[attempt]} alt={video.title} fill
      sizes="(min-width: 1280px) 360px, (min-width: 768px) calc(50vw - 64px), calc(100vw - 64px)"
      loading="lazy" decoding="async" onError={() => setAttempt((value) => value + 1)}
      className="object-contain transition duration-300 hover:scale-[1.02]" />
  </div>;
}

function SectionNotice({ state }: { state: SectionState }) {
  if (state.status !== "stale" && state.status !== "error") return null;
  const date = state.checkedAt ? new Date(state.checkedAt).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }) : null;
  return <p role="status" className="mb-3 text-sm text-amber-200">
    {state.status === "stale" ? "更新を確認できないため、前回の情報を表示しています。" : "現在、情報を取得できません。"}
    {date && <span className="block">最終確認：{date}</span>}
  </p>;
}

function YouTubeCard({ video, live = false, shorts = false }: { video: VideoItem; live?: boolean; shorts?: boolean }) {
  return <div className="space-y-3">
    {live && video.embeddable ? <iframe
      key={video.id} src={`https://www.youtube-nocookie.com/embed/${video.id}`}
      title={video.title} className="aspect-video min-h-[202px] w-full rounded-2xl border border-white/10"
      loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> :
      <a href={video.url} target="_blank" rel="noopener noreferrer"
        className="block overflow-hidden rounded-2xl border border-white/10">
        <VideoThumbnail key={`${video.id}-${video.thumbnail}`} video={video} />
      </a>}
    <a href={video.url} target="_blank" rel="noopener noreferrer"
      className="block break-words text-sky-200 underline underline-offset-4 hover:text-white">{video.title}</a>
    {!live && video.publishedAt && <p className="text-xs text-slate-300">公開：<time dateTime={video.publishedAt}>{new Date(video.publishedAt).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}</time></p>}
    {shorts && <a href={video.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-xl bg-rose-500/20 px-4 py-2 text-sm font-bold text-rose-100 ring-1 ring-rose-300/30 hover:bg-rose-500/30">このShortsを見る ↗</a>}
    {live && <p className="text-sm text-slate-300">再生できない場合は、上のリンクからYouTubeでご覧ください。</p>}
  </div>;
}

const visuals = [
  { id: "bunny", label: "バニー衣装", src: "/aquari-full.png" },
  { id: "shrine", label: "巫女衣装", src: "/aquari-shrine.png" },
  { id: "casual", label: "私服", src: "/aquari-casual.png" },
];

function TwitchPlayer({ src }: { src: string }) {
  const container = useRef<HTMLDivElement | null>(null);
  const [fits, setFits] = useState(false);
  useEffect(() => {
    if (!container.current) return;
    const observer = new ResizeObserver(([entry]) => {
      // Include the border so the player viewport stays at least 400px wide.
      setFits(entry.contentRect.width >= 402);
    });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={container}>
    {fits && src ? <iframe src={src} title="Aquari Twitch Live"
      loading="lazy" allow="autoplay; fullscreen; picture-in-picture"
      referrerPolicy="strict-origin-when-cross-origin" allowFullScreen
      className="h-[360px] w-full rounded-2xl border border-white/10" /> :
      <div className="rounded-2xl border border-purple-300/20 bg-purple-500/10 p-5">
        <p className="mb-4 text-sm leading-6 text-slate-200">Twitchの配信は、こちらからご覧いただけます。</p>
        <a href="https://www.twitch.tv/aquarivt" target="_blank" rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-xl bg-purple-600 px-5 py-3 font-bold hover:bg-purple-500">Twitchで配信を見る ↗</a>
      </div>}
  </div>;
}

function VisualGallery() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const visual = visuals[selected];

  return <section id="visuals" className="scroll-mt-6 rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl sm:p-6 backdrop-blur-md">
    <h2 className="mb-5 text-2xl font-bold">ビジュアル</h2>
    <div role="tablist" aria-label="衣装を選ぶ" className="mb-5 grid grid-cols-3 gap-2"
      onKeyDown={(event) => {
        let next: number;
        if (event.key === "ArrowRight") next = (selected + 1) % visuals.length;
        else if (event.key === "ArrowLeft") next = (selected + visuals.length - 1) % visuals.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = visuals.length - 1;
        else return;
        event.preventDefault();
        setSelected(next);
        tabs.current[next]?.focus();
      }}>
      {visuals.map((item, index) => <button key={item.id} type="button" role="tab"
        id={`visual-tab-${item.id}`} aria-selected={selected === index} aria-controls="visual-panel"
        tabIndex={selected === index ? 0 : -1} ref={(element) => { tabs.current[index] = element; }}
        onClick={() => setSelected(index)}
        className={`rounded-xl border px-2 py-3 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300 ${selected === index ? "border-sky-300/60 bg-sky-500/25 text-sky-100" : "border-white/10 bg-black/10 text-slate-300 hover:bg-white/10"}`}>
        {item.label}
      </button>)}
    </div>
    <div id="visual-panel" role="tabpanel" aria-labelledby={`visual-tab-${visual.id}`} tabIndex={0}
      className="rounded-2xl border border-white/10 bg-black/10 p-3 focus-visible:outline-2 focus-visible:outline-sky-300">
      <h3 className="px-2 pt-1 text-lg font-semibold text-cyan-100">{visual.label}</h3>
      <div className="relative mt-3 h-[420px] overflow-hidden rounded-xl bg-white/5 sm:h-[580px]">
        <Image key={visual.id} src={visual.src} alt={`Aquari ${visual.label}ビジュアル`} fill
          sizes="(min-width: 1280px) 580px, (min-width: 1024px) 48vw, calc(100vw - 112px)"
          className="object-contain" />
      </div>
    </div>
  </section>;
}

type ScheduleItem = {
  day: string;
  time: string;
  title: string;
  note: string;
  color: string;
};

// Set these only when the streaming schedule is confirmed; never substitute today's date.
// startDate is the Monday of the target week. Both dates use YYYY-MM-DD in Japan time.
const scheduleDates: { startDate: string | null; updatedAt: string | null } = {
  startDate: null,
  updatedAt: null,
};

function scheduleDateLabel(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "numeric", day: "numeric" })
    .format(new Date(`${value}T00:00:00+09:00`));
}

function scheduleWeekLabel(startDate: string | null) {
  if (!startDate) return "対象週：未設定";
  const end = new Date(`${startDate}T00:00:00+09:00`);
  end.setUTCDate(end.getUTCDate() + 6);
  return `対象週：${scheduleDateLabel(startDate)}〜${new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", month: "numeric", day: "numeric" }).format(end)}`;
}

const weeklySchedule: ScheduleItem[] = [
  {
    day: "月曜日",
    time: "15:00～",
    title: "Escape from tarkov",
    note: "参加型配信",
    color: "border-red-400/30 bg-red-500/15",
  },
{
    day: "火曜日",
    time: "15:00〜",
    title: "Apex legends",
    note: "参加型配信",
    color: "border-sky-400/40 bg-sky-500/20",
  },
  {
    day: "水曜日",
    time: "14:00〜",
    title: "Rainbow Six Siege",
    note: "参加型配信",
    color: "border-red-400/30 bg-red-500/15",
  },
{
    day: "木曜日",
    time: "14:00〜",
    title: "Escape from tarkov",
    note: "参加型配信",
    color: "border-sky-400/40 bg-sky-500/20",
  },
  {
    day: "金曜日",
    time: "14:00〜",
    title: "Apex legends",
    note: "参加型配信",
    color: "border-sky-400/40 bg-sky-500/20",
  },
{
    day: "土曜日",
    time: "14:00〜",
    title: "Rainbow Six Siege",
    note: "",
    color: "border-sky-400/40 bg-sky-500/20",
  },
  {
    day: "日曜日",
    time: "13:00～",
    title: "Apex legends",
    note: "参加型配信",
    color: "border-sky-400/40 bg-sky-500/20",
  },
];

export default function Home() {
  const hostname = useSyncExternalStore(subscribeToHostname, getHostname, getServerHostname);
  const twitchSrc = hostname ? `https://player.twitch.tv/?channel=aquarivt&parent=${encodeURIComponent(hostname)}&autoplay=false` : "";
  const [latest, setLatest] = useState<LatestResponse>(emptyLatest);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const refreshRef = useRef<(() => void) | null>(null);
  const refresh = useCallback(() => refreshRef.current?.(), []);

  const fixedVideoId = "HuQbQ9e4eJ8";
  const fixedVideoUrl = "https://youtu.be/HuQbQ9e4eJ8";
  const fixedThumbnail = `https://img.youtube.com/vi/${fixedVideoId}/hqdefault.jpg`;

  const playlistUrl =
    "https://www.youtube.com/playlist?list=PLNk3vHgBJiOmmxj74gSiYj5ajHAmr3oQb";
  const playlistEmbedUrl =
    "https://www.youtube.com/embed/videoseries?list=PLNk3vHgBJiOmmxj74gSiYj5ajHAmr3oQb";

  useEffect(() => {
    let disposed = false;
    let controller: AbortController | null = null;
    let lastAttempt = 0;
    let failures = 0;

    const loadLatest = async (manual = false) => {
      if (disposed || controller || (!manual && document.visibilityState === "hidden")) return;
      const interval = Math.min(60000 * 2 ** failures, 900000);
      if (!manual && Date.now() - lastAttempt < interval) return;
      lastAttempt = Date.now();
      controller = new AbortController();
      const activeController = controller;
      const timeout = window.setTimeout(() => activeController.abort(), 30000);
      setRefreshing(true);
      try {
        const response = await fetch("/api/youtube/latest", { cache: "no-store", signal: activeController.signal });
        if (!response.ok) throw new Error("request_failed");
        const data = readLatest(await response.json());
        if (disposed) return;
        setLatest((previous) => mergeLatest(previous, data));
        setRequestError(false);
        // A partial section failure must not slow down healthy LIVE updates.
        // Transport failures (including an all-failed 503) back off in catch.
        failures = 0;
      } catch {
        if (disposed) return;
        failures = Math.min(failures + 1, 3);
        setRequestError(true);
        setLatest((previous) => mergeLatest(previous, emptyLatest));
      } finally {
        window.clearTimeout(timeout);
        controller = null;
        if (!disposed) { setLoading(false); setRefreshing(false); }
      }
    };
    refreshRef.current = () => { void loadLatest(true); };
    const onVisible = () => { void loadLatest(); };
    void loadLatest();
    const timer = window.setInterval(onVisible, 60000);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    window.addEventListener("online", onVisible);
    return () => {
      disposed = true;
      controller?.abort();
      refreshRef.current = null;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
      window.removeEventListener("online", onVisible);
    };
  }, []);

  const youtubeDisplay = latest.currentLive ?? latest.latestArchive;
  const isLive = latest.sections.live.status === "ok" && !!latest.currentLive;
  const displaySection = isLive ? latest.sections.live : latest.sections.archive;

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/aquari-bg.png')" }}
      />
      <div className="fixed inset-0 -z-10 bg-slate-950/80 backdrop-blur-[3px]" />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-5 sm:py-8 md:px-8 md:py-12">
        <header className="mb-10 rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl sm:p-6 backdrop-blur-md md:p-10">
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

          <nav aria-label="ページ内メニュー" className="mt-6 flex flex-wrap gap-3">
            <a href="#streams" className="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-bold transition hover:bg-sky-400">配信・最新動画</a>
            <a href="#visuals" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold transition hover:bg-white/10">ビジュアル</a>
            <a href="#schedule" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold transition hover:bg-white/10">配信予定</a>
          </nav>

          {isLive && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-red-300/40 bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-[0_0_20px_rgba(239,68,68,0.45)]">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
              現在YouTube配信中
            </div>
          )}
        </header>

        <section id="streams" aria-label="配信・最新動画" className="mb-8 scroll-mt-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p role="status" className="text-sm text-slate-300">
                {requestError ? "動画情報の更新に失敗しました。時間を置いて再試行してください。" :
                  !loading && latest.sections.live.status === "error" ? "現在の配信状況を確認できません。YouTubeでもご確認ください。" :
                    "配信・動画情報は自動で更新されます。"}
              </p>
              <button type="button" onClick={refresh} disabled={refreshing}
                className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-bold transition hover:bg-sky-400 disabled:cursor-wait disabled:opacity-50">
                {refreshing ? "確認中…" : "更新する"}
              </button>
            </div>

            <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
              <section className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl sm:p-6 backdrop-blur-md">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold">{isLive ? "YouTube配信中" : "最新アーカイブ"}</h2>
                  {isLive && <span className="inline-flex items-center gap-2 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />LIVE
                  </span>}
                </div>
                {loading ? <div role="status" className="flex aspect-video items-center justify-center rounded-2xl bg-black/30 text-slate-300">読み込み中…</div> : <>
                  <SectionNotice state={displaySection} />
                  {youtubeDisplay ? <YouTubeCard video={youtubeDisplay} live={isLive} /> :
                    <div className="rounded-2xl bg-black/20 p-4 text-slate-300">
                      {displaySection.status === "error" ? "動画情報を取得できませんでした。" : "表示できるアーカイブはありません。"}
                      <a href={`${CHANNEL_URL}/streams`} target="_blank" rel="noopener noreferrer" className="mt-3 block text-sky-300 underline">YouTubeの配信一覧を見る ↗</a>
                    </div>}
                </>}
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl sm:p-6 backdrop-blur-md">
                <h2 className="mb-4 text-2xl font-bold">最新の動画</h2>
                {loading ? <div role="status" className="flex aspect-video items-center justify-center rounded-2xl bg-black/30 text-slate-300">読み込み中…</div> : <>
                  <SectionNotice state={latest.sections.video} />
                  {latest.latestVideo ? <YouTubeCard video={latest.latestVideo} /> :
                    <p className="rounded-2xl bg-black/20 p-4 text-slate-300">{latest.sections.video.status === "error" ? "通常動画の情報を確認できませんでした。" : "直近の公開動画に表示できる通常動画はありません。"}</p>}
                  <a href={`${CHANNEL_URL}/videos`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sky-300 underline underline-offset-4">動画一覧を見る ↗</a>
                </>}
              </section>

              <section className="rounded-3xl border border-rose-300/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md sm:p-6">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold">最新のShorts</h2>
                  <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-200">Shorts</span>
                </div>
                {loading ? <div role="status" className="flex aspect-video items-center justify-center rounded-2xl bg-black/30 text-slate-300">読み込み中…</div> : <>
                  <SectionNotice state={latest.sections.shorts} />
                  {latest.latestShort ? <YouTubeCard video={latest.latestShort} shorts /> :
                    <p className="rounded-2xl bg-black/20 p-4 text-slate-300">
                      {latest.sections.shorts.status === "unconfigured" ? "Short動画はYouTubeで公開しています。" :
                        latest.sections.shorts.status === "error" ? "Short動画の情報を取得できませんでした。" : "表示できるShort動画はありません。"}
                    </p>}
                  <a href={SHORTS_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sky-300 underline underline-offset-4">Shorts一覧を見る ↗</a>
                </>}
              </section>
            </div>

            <section className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl sm:p-6 backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">Twitch配信</h2>

              <TwitchPlayer src={twitchSrc} />
              <a href="https://www.twitch.tv/aquarivt" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sky-300 underline underline-offset-4">再生できない場合はTwitchで見る ↗</a>
            </section>
        </section>

        <section className="grid items-start gap-8 lg:grid-cols-2">
            <section id="schedule" className="scroll-mt-6 rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl sm:p-6 backdrop-blur-md">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-bold">配信スケジュール</h2>
                <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-200">
                  {scheduleDates.startDate ? "週間予定" : "対象週未設定"}
                </span>
              </div>

              <div className="mb-5 space-y-1 text-sm text-slate-300">
                <p>{scheduleWeekLabel(scheduleDates.startDate)}（日本時間）</p>
                {scheduleDates.updatedAt && <p>予定の更新日：<time dateTime={scheduleDates.updatedAt}>{scheduleDateLabel(scheduleDates.updatedAt)}</time></p>}
                {!scheduleDates.startDate && <p>掲載中の予定は対象週を確認中です。最新の予定はXをご確認ください。</p>}
              </div>
              <div className="grid gap-2">
                {weeklySchedule.map((item) => (
                  <div key={`${item.day}-${item.time}-${item.title}`}
                    className={`grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-3 rounded-xl border px-3 py-3 ${item.color}`}>
                    <h3 className="text-center text-base font-bold"><span aria-hidden="true">{item.day.slice(0, 1)}</span><span className="sr-only">{item.day}</span></h3>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <p className="break-words text-sm font-semibold sm:text-base">{item.title}</p>
                        {item.time && <p className="shrink-0 text-sm font-bold tabular-nums text-sky-200">{item.time}</p>}
                      </div>
                      {item.note && <p className="mt-1 text-xs text-slate-300">{item.note}</p>}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-sm text-slate-400">
                ※スケジュールは変更になる場合があります。<a href="https://x.com/Aquari_Vt" target="_blank" rel="noopener noreferrer" className="text-sky-300 underline underline-offset-4">最新情報をXで確認 ↗</a>
              </p>
            </section>
            <VisualGallery />
            <section className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl sm:p-6 backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">タグ一覧</h2>

              <div className="space-y-3 text-slate-200">
                <p>
                  配信（切り抜きも）：
                  <a
                    href="https://x.com/search?q=%23Aquari%E9%85%8D%E4%BF%A1&src=typed_query"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sky-300 underline underline-offset-4 hover:text-sky-200"
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
                    className="ml-2 text-sky-300 underline underline-offset-4 hover:text-sky-200"
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
                    className="ml-2 text-sky-300 underline underline-offset-4 hover:text-sky-200"
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
                    className="ml-2 text-sky-300 underline underline-offset-4 hover:text-sky-200"
                  >
                    #アクエリ飲んだ
                  </a>
                </p>
              </div>
            </section>
            <section className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl sm:p-6 backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">SNS / Channel</h2>

              <div className="grid gap-3">
                <a
                  href="https://x.com/Aquari_Vt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-sky-500 px-4 py-3 text-center font-bold transition hover:bg-sky-600"
                >
                  X
                </a>

                <a
                  href="https://www.youtube.com/channel/UCBvSY3MYEkkJ194_Zdjp2Jw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-red-500 px-4 py-3 text-center font-bold transition hover:bg-red-600"
                >
                  YouTube
                </a>

                <a
                  href="https://www.twitch.tv/aquarivt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-purple-600 px-4 py-3 text-center font-bold transition hover:bg-purple-700"
                >
                  Twitch
                </a>

                <a
                  href="/achievements"
                  className="rounded-2xl bg-amber-500 px-4 py-3 text-center font-bold transition hover:bg-amber-600"
                >
                  大会実績
                </a>

                <a
                  href="https://x.com/AtelierDia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-slate-700 px-4 py-3 text-center font-bold leading-6 transition hover:bg-slate-600"
                >
                  イラスト制作・Live2D制作者様
                  <br />
                  DIAさん
                </a>
              </div>
            </section>
            <section className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl sm:p-6 backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold">固定動画</h2>

              <a
                href={fixedVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-2xl border border-white/10"
              >
                <VideoThumbnail video={{ id: fixedVideoId, title: "Aquari 固定動画", thumbnail: fixedThumbnail, url: fixedVideoUrl, embeddable: true }} />
              </a>

              <a
                href={fixedVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-2xl bg-red-500 px-4 py-3 font-bold transition hover:bg-red-600"
              >
                YouTubeで見る
              </a>
            </section>
            <section className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl sm:p-6 backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold">おすすめPlaylist</h2>

                <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-200">
                  YouTube
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  src={playlistEmbedUrl}
                  loading="lazy" referrerPolicy="strict-origin-when-cross-origin"
                  title="Aquari YouTube Playlist"
                  className="aspect-video min-h-[200px] w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <a
                href={playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-2xl bg-red-500 px-4 py-3 font-bold transition hover:bg-red-600"
              >
                Playlistを開く
              </a>
            </section>
        </section>

        <footer className="mt-10 text-center text-slate-400">
          © Aquari
        </footer>
      </div>
    </main>
  );
}
