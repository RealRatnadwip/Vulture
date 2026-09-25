import { GoogleGenerativeAI } from "@google/generative-ai";
import { geminiClassificationSchema, GeminiClassification } from "@/lib/validation";
import { classifyDeterministic } from "./classifier";

const GEMINI_SYSTEM_PROMPT = `You are the message-priority engine for VULTURE, a small-group voice broadcast system.

Your job is not to judge whether a person is important.
Your job is to determine how urgently a group needs to notice the information contained in the message.

CRITICAL:
Immediate attention required.
Examples: production outage, safety issue, deadline happening now.

HIGH:
Important action or schedule change.
Examples: meeting moved, important task assigned, deployment warning.

NORMAL:
Useful information that does not require immediate action.

LOW:
Casual status updates or information that can safely wait.

Never invent facts.
Never infer private information.
Never classify based on who sent the message.
Classify only from the content and available temporal context.

Return STRICT JSON only matching this schema:
{
  "summary": "Short, ultra-clear 1-sentence summary (max 20 words)",
  "priority": "LOW" | "NORMAL" | "HIGH" | "CRITICAL",
  "category": "STATUS" | "SCHEDULE" | "TASK" | "INCIDENT" | "DECISION" | "INFORMATION" | "SOCIAL" | "OTHER",
  "urgencyScore": number between 0 and 100,
  "expiresInMinutes": integer between 5 and 1440
}`;

export interface ClassifyContext {
  groupName?: string;
  recentMessages?: Array<{ sender: string; transcript: string; priority: string }>;
}

export async function classifyBroadcast(
  transcript: string,
  context?: ClassifyContext
): Promise<GeminiClassification> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    // Graceful fallback to deterministic keyword classification
    return classifyDeterministic(transcript);
  }

  const userPrompt = `Current Timestamp: ${new Date().toISOString()}
Group Name: ${context?.groupName || "General Group"}
Recent Messages Context:
${
  context?.recentMessages && context.recentMessages.length > 0
    ? context.recentMessages
        .slice(-3)
        .map((m) => `- ${m.sender}: "${m.transcript}" (${m.priority})`)
        .join("\n")
    : "None"
}

New Spoken Transcript:
"${transcript}"

Analyze this transcript and return strict JSON.`;

  // Attempt up to 2 times (retry once on schema failure)
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // Gemini 3.5 Flash Lite is ultra-fast, high-availability, and fully supported
      const modelName = process.env.GEMINI_MODEL || (attempt === 1 ? "gemini-3.5-flash-lite" : "gemini-3.8-flash");
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: GEMINI_SYSTEM_PROMPT,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const result = await model.generateContent(userPrompt);
      const responseText = result.response.text();

      // Clean markdown code fence if wrapped
      const cleanJson = responseText.replace(/```json\s*/g, "").replace(/```\s*$/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      const validated = geminiClassificationSchema.safeParse(parsed);

      if (validated.success) {
        return validated.data;
      }

      console.warn(`[Gemini] Attempt ${attempt} validation failed:`, validated.error);
    } catch (err) {
      console.warn(`[Gemini] Attempt ${attempt} error:`, err);
    }
  }

  // If retries failed, fall back safely
  console.info("[Gemini] Falling back to deterministic classifier.");
  return classifyDeterministic(transcript);
}
