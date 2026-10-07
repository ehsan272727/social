import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export function getRelativeTime(targetDate: Date): string {
  dayjs.extend(relativeTime);
  const date = dayjs(targetDate);
  const now = dayjs();

  const minutes = now.diff(date, "minute");

  if (minutes < 1) {
    return "Just now";
  }

  const hours = now.diff("created", "hour");

  if (hours >= 24 && hours < 48) {
    return "Yesterday";
  }

  if (date.isSame(now, "year")) {
    return date.fromNow();
  }

  return date.format("MMM D, YYYY");
}
