# Sponsor Track Integrations

### 1. Tiger Data (PostgreSQL & Drizzle ORM)
- **Role**: High-concurrency cloud persistence layer for channels, membership verification, and temporal broadcasts.
- **Integration**: Integrated via Tiger Data's managed PostgreSQL cluster using Drizzle ORM. Schemas define relational entities (`users`, `groups`, `group_members`, `messages`) with multi-column indexes on `(group_id, created_at, priority)` to power sub-millisecond polling, live presence tracking, and time-decay calculations.

---

### 2. ElevenLabs (Scribe Speech-To-Text)
- **Role**: Real-time voice intelligence engine eliminating typing friction.
- **Integration**: Browser microphone audio recorded in WebM Opus format is streamed to our Next.js edge route and dispatched directly to the ElevenLabs Scribe STT API. Returns accurate, punctuation-aware transcripts in milliseconds, enabling responders to broadcast hands-free during active outages.

---

### 3. Auth0 (Identity & Private Channel Isolation)
- **Role**: Secure squad authentication and zero-trust channel boundary enforcement.
- **Integration**: Configured via Auth0's Next.js SDK for seamless user authentication and session management. Enforces strict cryptographic access tokens on private group feeds so that broadcasts, member presence, and audio streams remain completely isolated strictly to verified squad teammates.

---

### 4. Google Cloud / Gemini API (Gemini 3.5 Triage Engine)
- **Role**: Real-time cognitive triage, urgency ranking, and temporal decay curve calculation.
- **Integration**: Integrated via the `@google/genai` SDK using `gemini-2.5-flash` / `gemini-1.5-flash`. Inspects raw spoken transcripts and recent channel context to infer incident priority (`CRITICAL`, `HIGH`, `NORMAL`, `LOW`), synthesize a 1-sentence executive briefing, assign an urgency score (0–100), and calculate dynamic half-life decay windows (5m to 24h) via strict Zod JSON schemas.
