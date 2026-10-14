export type YouTubeVideo = {
  id: string;
  snippet?: {
    channelId?: string; title?: string; publishedAt?: string;
    thumbnails?: Record<string, { url?: string }>; liveBroadcastContent?: string;
  };
  contentDetails?: { duration?: string };
  status?: { privacyStatus?: string; embeddable?: boolean };
  liveStreamingDetails?: { actualStartTime?: string; actualEndTime?: string; scheduledStartTime?: string };
};
export type ShortsIndex = { ids: string[]; complete: boolean; checkedAt: string };

export function durationSeconds(duration?: string): number | null {
  if (!duration) return null;
  const match = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/.exec(duration);
  if (!match || !match.slice(1).some((part) => part !== undefined)) return null;
  return Number(match[1] || 0) * 86400 + Number(match[2] || 0) * 3600
    + Number(match[3] || 0) * 60 + Number(match[4] || 0);
}

export function isLiveCandidate(video: YouTubeVideo) {
  return ["live", "upcoming"].includes(video.snippet?.liveBroadcastContent || "")
    && !video.liveStreamingDetails?.actualEndTime;
}
export function isActiveLive(video: YouTubeVideo) {
  return video.snippet?.liveBroadcastContent === "live" && !video.liveStreamingDetails?.actualEndTime;
}

export function selectLatestUpload(videos: YouTubeVideo[], shorts: ShortsIndex | null): { video: YouTubeVideo | null; uncertain: boolean } {
  const shortIds = new Set(shorts?.ids || []);
  const uploads = videos.filter((video) => video.snippet?.liveBroadcastContent === "none"
    && !video.liveStreamingDetails?.actualStartTime && !video.liveStreamingDetails?.actualEndTime
    && !video.liveStreamingDetails?.scheduledStartTime)
    .sort((a, b) => Date.parse(b.snippet?.publishedAt || "") - Date.parse(a.snippet?.publishedAt || ""));
  for (const video of uploads) {
    if (shortIds.has(video.id)) continue;
    const seconds = durationSeconds(video.contentDetails?.duration);
    if (seconds !== null && seconds > 180) return { video, uncertain: false };
    // A short duration is not proof of Shorts. Only exclude Shorts using a
    // complete, fresh catalog; allow time for newly published items to appear.
    const publishedAt = Date.parse(video.snippet?.publishedAt || "");
    if (seconds !== null && seconds > 0 && shorts?.complete
      && Number.isFinite(publishedAt) && Date.parse(shorts.checkedAt) - publishedAt >= 30 * 60 * 1000) {
      return { video, uncertain: false };
    }
    // Do not label an older upload "latest" while a newer item is ambiguous.
    return { video: null, uncertain: true };
  }
  return { video: null, uncertain: false };
}
