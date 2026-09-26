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
    badgeBg: "rgba(253, 164, 175, 0.18)",
    badgeBorder: "rgba(253, 164, 175, 0.45)",
    badgeText: "#FDA4AF",
    flashBg: "rgba(253, 164, 175, 0.35)",
    borderColor: "#FDA4AF",
    glowShadow: "0 0 50px rgba(253, 164, 175, 0.5), inset 0 0 80px rgba(253, 164, 175, 0.3)",
    accentHex: "#FDA4AF",
  },
  HIGH: {
    label: "HIGH PRIORITY",
    sublabel: "URGENT SQUAD BROADCAST",
    badgeBg: "rgba(253, 186, 116, 0.18)",
    badgeBorder: "rgba(253, 186, 116, 0.45)",
    badgeText: "#FDBA74",
    flashBg: "rgba(253, 186, 116, 0.28)",
    borderColor: "#FDBA74",
    glowShadow: "0 0 35px rgba(253, 186, 116, 0.45), inset 0 0 50px rgba(253, 186, 116, 0.25)",
    accentHex: "#FDBA74",
  },
  NORMAL: {
    label: "SQUAD BROADCAST",
    sublabel: "LIVE VOICE TRANSMISSION",
    badgeBg: "rgba(212, 246, 91, 0.14)",
    badgeBorder: "rgba(212, 246, 91, 0.4)",
    badgeText: "#D4F65B",
    flashBg: "rgba(212, 246, 91, 0.22)",
    borderColor: "#D4F65B",
    glowShadow: "0 0 30px rgba(212, 246, 91, 0.35), inset 0 0 45px rgba(212, 246, 91, 0.18)",
    accentHex: "#D4F65B",
  },
  LOW: {
    label: "ROUTINE TRANSMISSION",
    sublabel: "BACKGROUND SQUAD COMM",
    badgeBg: "rgba(125, 211, 252, 0.12)",
    badgeBorder: "rgba(125, 211, 252, 0.35)",
    badgeText: "#7DD3FC",
    flashBg: "rgba(125, 211, 252, 0.15)",
    borderColor: "#7DD3FC",
    glowShadow: "0 0 25px rgba(125, 211, 252, 0.25), inset 0 0 30px rgba(125, 211, 252, 0.12)",
    accentHex: "#7DD3FC",
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
