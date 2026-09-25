export type RelevanceState = "ACTIVE" | "EXPIRING" | "EXPIRED";

export interface RelevanceResult {
  state: RelevanceState;
  remainingMs: number;
  totalDurationMs: number;
  remainingPercentage: number;
  label: string;
}

/**
 * Calculates whether a broadcast message is ACTIVE, EXPIRING, or EXPIRED.
 * VULTURE treats information as having a half-life:
 * Messages naturally fade in prominence as their urgency window lapses.
 */
export function getMessageRelevance(
  message: { createdAt: Date | string; expiresAt: Date | string },
  now: Date = new Date()
): RelevanceResult {
  const created = new Date(message.createdAt).getTime();
  const expires = new Date(message.expiresAt).getTime();
  const current = now.getTime();

  const totalDurationMs = Math.max(1, expires - created);
  const remainingMs = expires - current;
  const remainingPercentage = Math.max(0, Math.min(100, (remainingMs / totalDurationMs) * 100));

  if (remainingMs <= 0) {
    const elapsedSinceExpiry = Math.abs(remainingMs);
    const minsAgo = Math.floor(elapsedSinceExpiry / (60 * 1000));
    const hoursAgo = Math.floor(minsAgo / 60);

    return {
      state: "EXPIRED",
      remainingMs,
      totalDurationMs,
      remainingPercentage: 0,
      label: minsAgo < 1 ? "expired just now" : minsAgo < 60 ? `expired ${minsAgo}m ago` : `expired ${hoursAgo}h ago`,
    };
  }

  // If less than 20% remains or less than 5 minutes remain
  const isExpiring = remainingPercentage <= 20 || remainingMs <= 5 * 60 * 1000;

  const remainingMins = Math.ceil(remainingMs / (60 * 1000));
  const remainingHours = Math.floor(remainingMins / 60);

  const timeLabel =
    remainingMins < 60
      ? `valid for ${remainingMins}m`
      : remainingHours === 1
      ? `valid for 1h`
      : `valid for ${remainingHours}h`;

  return {
    state: isExpiring ? "EXPIRING" : "ACTIVE",
    remainingMs,
    totalDurationMs,
    remainingPercentage,
    label: timeLabel,
  };
}

/**
 * Formats time elapsed since created (e.g. "12:41" or "2m ago")
 */
export function formatBroadcastTime(dateInput: Date | string): string {
  const date = new Date(dateInput);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
