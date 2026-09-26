# Challenges We Ran Into

### 1. Browser WebM Audio Streaming & Codec Fragmentation
- **The Hurdle**: The browser `MediaRecorder` API outputs variable Opus/WebM container headers depending on the client platform (Android Chrome vs. Desktop Safari). When streaming voice audio to the server, malformed container chunk boundaries occasionally caused ElevenLabs Scribe to reject audio buffers.
- **How We Solved It**: Standardized binary audio capture by probing supported MIME types (`audio/webm;codecs=opus` with fallback to `audio/webm`), capturing audio in discrete 100ms time-slices, and properly finalizing the container headers into a clean `Blob` before dispatching to our server-side transcription handler.

---

### 2. Eliminating LLM Hallucinations & Schema Drift in Real-Time Triage
- **The Hurdle**: Real-time broadcast triage requires deterministic urgency scores, discrete priority enums, and tight half-life windows. Early LLM prompts occasionally returned markdown commentary or conversational preambles that broke downstream JSON parsing.
- **How We Solved It**: Integrated Google Gemini 3.5 with strict Zod schema validation and calibrated operational few-shot prompts. We enforced strict JSON response mode, ensuring 100% deterministic output (`priority`, `urgencyScore`, `expiresInMinutes`, `summary`) with sub-second response times.

---

### 3. Cross-Device Tactile Alert Parity
- **The Hurdle**: Modern mobile browsers restrict the Web Vibration API (`navigator.vibrate`) unless explicitly triggered within active user gesture contexts, making incoming background alerts tricky to deliver haptically.
- **How We Solved It**: Architected an internal custom event bus (`vulture:flash`) tied to incoming polling streams. When a responder has the squad channel open, incoming high-priority messages immediately trigger priority-weighted rhythmic vibration pulses (e.g., rapid SOS patterns for `CRITICAL` incidents) paired with high-visibility screen strobe overlays.
