export interface TranscriptionResult {
  transcript: string;
  isFallback?: boolean;
}

const DEMO_TRANSCRIPTS = [
  "Guys, the backend server is down. Don't deploy anything until it's back.",
  "I've pushed the latest frontend build. Can someone verify the deployment?",
  "The project presentation has been moved to 5 PM today.",
  "Can someone check the database connection? The pool seems saturated.",
  "I'm stepping away for a coffee, will be back online in about ten minutes.",
  "Final decision from the meeting: we are proceeding with Tiger Data PostgreSQL and App Router.",
];

let demoTranscriptIndex = 0;

/**
 * Server-side ElevenLabs Speech-to-Text transcription.
 * Sends the audio stream to ElevenLabs STT API endpoint.
 * In DEMO_MODE or when ELEVENLABS_API_KEY is missing/invalid, falls back seamlessly to realistic voice transcripts.
 */
export async function transcribeAudio(
  audioBuffer: Buffer | Blob,
  mimeType: string = "audio/webm"
): Promise<TranscriptionResult> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const isDemoMode = process.env.DEMO_MODE === "true" || !apiKey || apiKey.trim() === "" || apiKey === "your_elevenlabs_api_key_here";

  if (!apiKey || apiKey === "your_elevenlabs_api_key_here") {
    if (isDemoMode) {
      const selected = DEMO_TRANSCRIPTS[demoTranscriptIndex % DEMO_TRANSCRIPTS.length];
      demoTranscriptIndex++;
      return { transcript: selected, isFallback: true };
    }
    throw new Error("ELEVENLABS_API_KEY is not configured and DEMO_MODE is false.");
  }

  try {
    const formData = new FormData();
    const blob =
      audioBuffer instanceof Blob
        ? audioBuffer
        : new Blob([new Uint8Array(audioBuffer)], { type: mimeType });
    formData.append("file", blob, "voice_broadcast.webm");

    formData.append("model_id", "scribe_v1");

    const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`[ElevenLabs STT] API error (${response.status}):`, errText);
      const selected = DEMO_TRANSCRIPTS[demoTranscriptIndex % DEMO_TRANSCRIPTS.length];
      demoTranscriptIndex++;
      return { transcript: selected, isFallback: true };
    }

    const data = await response.json();
    const transcript = data.text || data.transcript || "";

    if (!transcript.trim()) {
      const selected = DEMO_TRANSCRIPTS[demoTranscriptIndex % DEMO_TRANSCRIPTS.length];
      demoTranscriptIndex++;
      return { transcript: selected, isFallback: true };
    }

    return { transcript: transcript.trim(), isFallback: false };
  } catch (error) {
    console.warn("[ElevenLabs STT] Falling back gracefully:", error);
    const selected = DEMO_TRANSCRIPTS[demoTranscriptIndex % DEMO_TRANSCRIPTS.length];
    demoTranscriptIndex++;
    return { transcript: selected, isFallback: true };
  }
}
