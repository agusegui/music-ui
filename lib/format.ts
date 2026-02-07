/**
 * Format milliseconds to m:ss or h:mm:ss.
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Format seconds (from audio element) to m:ss or h:mm:ss.
 */
export function formatSeconds(secs: number): string {
  return formatDuration(secs * 1000);
}

/**
 * Sum durations of tracks in a playlist and format.
 */
export function formatTotalDuration(durations: number[]): string {
  const totalMs = durations.reduce((sum, d) => sum + d, 0);
  const totalMinutes = Math.floor(totalMs / 60000);

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`;
}
