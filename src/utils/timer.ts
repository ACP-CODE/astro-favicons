import { styler } from "./styler";

export function timeMsg(time: Date = new Date()) {
  const now = time || new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  return styler(`${hours}:${minutes}:${seconds}`, ["Dim"]);
}

export function formatTime(duration: number): string {
  return duration < 1000
    ? `${duration.toFixed()}ms`
    : `${(duration / 1000).toFixed(2)}s`;
}
