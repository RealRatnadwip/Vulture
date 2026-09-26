import { PriorityLevel } from "@/lib/validation";

export interface PriorityVisualConfig {
  label: string;
  sublabel: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  flashBg: string;
  borderColor: string;
  glowShadow: string;
  accentHex: string;
}

export const PRIORITY_CONFIG: Record<PriorityLevel, PriorityVisualConfig> = {
  CRITICAL: {
    label: "CRITICAL ALERT",
    sublabel: "IMMEDIATE SQUAD ATTENTION REQUIRED",
    badgeBg: "rgba(255, 69, 58, 0.2)",
    badgeBorder: "rgba(255, 69, 58, 0.5)",
    badgeText: "#FF453A",
    flashBg: "rgba(255, 69, 58, 0.38)",
    borderColor: "#FF453A",
    glowShadow: "0 0 50px rgba(255, 69, 58, 0.6), inset 0 0 80px rgba(255, 69, 58, 0.4)",
    accentHex: "#FF453A",
  },
  HIGH: {
    label: "HIGH PRIORITY",
    sublabel: "URGENT SQUAD BROADCAST",
    badgeBg: "rgba(255, 159, 10, 0.2)",
    badgeBorder: "rgba(255, 159, 10, 0.5)",
    badgeText: "#FF9F0A",
    flashBg: "rgba(255, 159, 10, 0.28)",
    borderColor: "#FF9F0A",
    glowShadow: "0 0 35px rgba(255, 159, 10, 0.45), inset 0 0 50px rgba(255, 159, 10, 0.25)",
    accentHex: "#FF9F0A",
  },
  NORMAL: {
    label: "SQUAD BROADCAST",
    sublabel: "INCOMING VOICE TRANSMISSION",
    badgeBg: "rgba(215, 242, 74, 0.15)",
    badgeBorder: "rgba(215, 242, 74, 0.45)",
    badgeText: "#D7F24A",
    flashBg: "rgba(215, 242, 74, 0.22)",
    borderColor: "#D7F24A",
    glowShadow: "0 0 25px rgba(215, 242, 74, 0.35), inset 0 0 40px rgba(215, 242, 74, 0.18)",
    accentHex: "#D7F24A",
  },
  LOW: {
    label: "ROUTINE TRANSMISSION",
    sublabel: "BACKGROUND SQUAD COMM",
    badgeBg: "rgba(100, 210, 255, 0.12)",
    badgeBorder: "rgba(100, 210, 255, 0.35)",
    badgeText: "#64D2FF",
    flashBg: "rgba(100, 210, 255, 0.15)",
    borderColor: "#64D2FF",
    glowShadow: "0 0 20px rgba(100, 210, 255, 0.25), inset 0 0 30px rgba(100, 210, 255, 0.12)",
    accentHex: "#64D2FF",
  },
};

/**
 * Triggers tactical haptic vibration patterns tailored to message priority.
 * Bridges both the standard Web Vibration API (Android Chrome / WebViews)
 * and the native Capacitor Haptics plugin.
 */
export async function triggerPriorityVibration(priority: PriorityLevel | string) {
  const normPriority: PriorityLevel =
    priority === "CRITICAL" || priority === "HIGH" || priority === "NORMAL" || priority === "LOW"
      ? priority
      : "NORMAL";

  // 1. Web Vibration API: Custom rhythmic vibration sequence
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      switch (normPriority) {
        case "CRITICAL":
          // Intense emergency pattern: pulse 350ms, gap 100ms, pulse 350ms, gap 100ms, pulse 600ms
          navigator.vibrate([350, 100, 350, 100, 600]);
          break;
        case "HIGH":
          // Warning double-pulse: pulse 250ms, gap 80ms, pulse 250ms
          navigator.vibrate([250, 80, 250]);
          break;
        case "NORMAL":
          // Solid tactical pulse: 120ms
          navigator.vibrate([120]);
          break;
        case "LOW":
          // Gentle tactile click: 40ms
          navigator.vibrate([40]);
          break;
      }
    } catch (err) {
      console.warn("[Vibration API] Web vibration not permitted or supported:", err);
    }
  }

  // 2. Capacitor Haptics Plugin: Native Android / iOS tactile motor
  if (typeof window !== "undefined") {
    try {
      const { Haptics, ImpactStyle, NotificationType } = await import("@capacitor/haptics");

      switch (normPriority) {
        case "CRITICAL":
          await Haptics.notification({ type: NotificationType.Error });
          await Haptics.vibrate({ duration: 700 });
          break;
        case "HIGH":
          await Haptics.notification({ type: NotificationType.Warning });
          break;
        case "NORMAL":
          await Haptics.impact({ style: ImpactStyle.Heavy });
          break;
        case "LOW":
          await Haptics.impact({ style: ImpactStyle.Light });
          break;
      }
    } catch {
      // Gracefully ignore if @capacitor/haptics is unavailable in current context
    }
  }
}
