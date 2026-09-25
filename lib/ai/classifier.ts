import { GeminiClassification } from "@/lib/validation";

/**
 * Deterministic fallback classifier when Gemini API is unavailable or unconfigured.
 * Matches keywords and temporal cues to assign accurate priority, category, summary, and expiry.
 */
export function classifyDeterministic(transcript: string): GeminiClassification {
  const text = transcript.toLowerCase();

  // CRITICAL patterns: outages, server down, crashes, fire, emergency, immediate blocking
  if (
    text.includes("server down") ||
    text.includes("production down") ||
    text.includes("database crash") ||
    text.includes("broken build") ||
    text.includes("emergency") ||
    text.includes("don't deploy") ||
    text.includes("outage") ||
    text.includes("site is down") ||
    text.includes("security alert")
  ) {
    return {
      summary: transcript.length > 80 ? transcript.slice(0, 77) + "..." : transcript,
      priority: "CRITICAL",
      category: "INCIDENT",
      urgencyScore: 95,
      expiresInMinutes: 30, // Critical incidents expire quickly unless renewed
    };
  }

  // HIGH patterns: deadlines, schedule changes, important tasks, urgent reviews
  if (
    text.includes("deadline") ||
    text.includes("meeting moved") ||
    text.includes("call moved") ||
    text.includes("check the database") ||
    text.includes("presentation is at") ||
    text.includes("urgent") ||
    text.includes("asap") ||
    text.includes("need approval") ||
    text.includes("action required")
  ) {
    const isSchedule = text.includes("meeting") || text.includes("presentation") || text.includes("call");
    return {
      summary: transcript.length > 80 ? transcript.slice(0, 77) + "..." : transcript,
      priority: "HIGH",
      category: isSchedule ? "SCHEDULE" : "TASK",
      urgencyScore: 78,
      expiresInMinutes: 120, // 2 hours
    };
  }

  // LOW patterns: casual status, joining late, coffee, social chatter
  if (
    text.includes("joining later") ||
    text.includes("join in") ||
    text.includes("be late") ||
    text.includes("grab coffee") ||
    text.includes("stepping away") ||
    text.includes("brb") ||
    text.includes("afk") ||
    text.includes("lunch")
  ) {
    return {
      summary: transcript.length > 80 ? transcript.slice(0, 77) + "..." : transcript,
      priority: "LOW",
      category: "STATUS",
      urgencyScore: 25,
      expiresInMinutes: 45, // Low status updates expire fast
    };
  }

  // Decisions
  if (
    text.includes("decided") ||
    text.includes("agreed to") ||
    text.includes("we will go with") ||
    text.includes("final decision")
  ) {
    return {
      summary: transcript.length > 80 ? transcript.slice(0, 77) + "..." : transcript,
      priority: "HIGH",
      category: "DECISION",
      urgencyScore: 70,
      expiresInMinutes: 240, // 4 hours
    };
  }

  // NORMAL patterns: code push, general updates, informative notes
  let category: GeminiClassification["category"] = "INFORMATION";
  if (text.includes("pushed") || text.includes("deployed") || text.includes("merged") || text.includes("commit")) {
    category = "STATUS";
  }

  return {
    summary: transcript.length > 80 ? transcript.slice(0, 77) + "..." : transcript,
    priority: "NORMAL",
    category,
    urgencyScore: 50,
    expiresInMinutes: 180, // 3 hours
  };
}
