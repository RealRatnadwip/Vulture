# VULTURE — Voice-First, Time-Aware Group Broadcasting

> *"information has a half-life."*

**VULTURE** is a small-group voice communication system answering:
> *"What did someone just say, and does it actually matter right now?"*

Users speak short voice broadcasts to a group. Audio is transcribed via **ElevenLabs Speech-to-Text**, analyzed & prioritized by **Gemini**, stored in **Tiger Data PostgreSQL** via **Drizzle ORM**, and broadcast to group members with subtle time-decay relevance.

---

## 1. Architecture & Core Pipeline

```
[ Browser / MediaRecorder ] (Hold to Speak)
           │
           ▼
[ POST /api/messages/create ] (Validates Group Membership & Auth)
           │
           ├──► [ ElevenLabs STT API ] ──► Extracts clean transcript
           │
           ├──► [ Gemini 1.5/2.0 Priority Engine ] (Strict JSON Schema)
           │      • priority: LOW | NORMAL | HIGH | CRITICAL
           │      • category: STATUS | SCHEDULE | TASK | INCIDENT | ...
           │      • urgencyScore: 0–100
           │      • expiresInMinutes: 5–1440
           │
           ├──► [ Tiger Data PostgreSQL / Drizzle ORM ] (Indexed persistence)
           │
           ▼
[ Realtime Group Feed ] (2s Polling & Incremental Merge)
           │
           ▼
[ Time-Decay Relevance Engine ] (ACTIVE ──► EXPIRING ──► EXPIRED)
```

---

## 2. Technology Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS (Dark-first aesthetic: `#0E0E0E` base, `#151515` surface, `#D7F24A` accent)
- **Database**: Tiger Data PostgreSQL with Drizzle ORM (`drizzle-orm`, `drizzle-kit`, `postgres`)
- **Speech-to-Text**: ElevenLabs Speech-to-Text API
- **AI Classification**: Google Gemini (`@google/generative-ai`) with deterministic keyword fallback
- **Authentication**: Auth0 (with `DEMO_MODE=true` multi-persona simulator)
- **Validation**: Zod
- **Icons**: Lucide React

---

## 3. Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
# Database (Tiger Data PostgreSQL / Local Postgres)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vulture

# Auth0 Authentication
AUTH0_SECRET=c3848b5938a1e2f494589d97a9cf58385d038205739281a8b9487c6e03828392
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://vulture.us.auth0.com
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret

# ElevenLabs Speech-to-Text
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Demo Mode (Allows instant evaluation without requiring external keys)
DEMO_MODE=true
```

---

## 4. Setup & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Migration & Seeding
```bash
# Generate schema migrations
npm run db:generate

# Push or apply migrations
npm run db:push
npm run db:migrate

# Seed demo users, groups, and realistic messages
npm run db:seed
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view VULTURE.

---

## 5. Demo Mode & Multi-Tab Evaluation

When `DEMO_MODE=true`:
1. **Multi-User Personas**: Switch between **Ratnadwip** (Lead), **Himanshu** (Frontend), **Koushik** (Systems), and **Ranit** (Design) from the top demo banner or login page.
2. **Instant Voice Simulator**: Broadcast without microphone hardware or external API credits using the pre-recorded voice scenario triggers.
3. **Graceful Fallbacks**:
   - ElevenLabs missing → Realistic transcript generator.
   - Gemini missing → Deterministic keyword priority classifier.
   - Database unreachable → Resilient in-memory seeded store with zero crash guarantee.

---

## 6. Service Integrations

### Tiger Data PostgreSQL Setup
1. Provision a PostgreSQL instance on Tiger Data.
2. Copy the connection string to `DATABASE_URL`.
3. Run `npm run db:push` to apply tables and indexes.

### Auth0 Setup
1. Create a Regular Web Application in the Auth0 Dashboard.
2. Set Allowed Callback URLs to `http://localhost:3000/api/auth/callback`.
3. Set Allowed Logout URLs to `http://localhost:3000/login`.
4. Copy Domain, Client ID, and Client Secret to `.env.local`.

### ElevenLabs STT Setup
1. Obtain an API key from ElevenLabs.
2. Assign it to `ELEVENLABS_API_KEY`.
3. Audio recordings recorded via the browser push-to-talk button will be transcribed via ElevenLabs' Speech-to-Text API.

### Gemini Setup
1. Obtain an API key from Google AI Studio.
2. Assign it to `GEMINI_API_KEY`.
3. The prompt evaluates urgency context, group history, and outputs strict Zod-validated JSON with urgency scores and relevance windows.

---

## 7. Package Scripts

- `npm run dev`: Starts Next.js development server
- `npm run build`: Compiles production bundle
- `npm run start`: Runs production server
- `npm run lint`: Runs ESLint
- `npm run db:generate`: Generates Drizzle migrations from schema
- `npm run db:migrate`: Executes database migrations
- `npm run db:push`: Pushes schema directly to database
- `npm run db:seed`: Seeds demo users, groups, and broadcasts

---

## 8. API Overview

| Route | Method | Description |
|---|---|---|
| `/api/health` | GET | System diagnostics (Tiger Data, Auth0, Gemini, ElevenLabs) |
| `/api/messages/create` | POST | Full broadcast pipeline (audio/transcript -> STT -> Gemini -> DB) |
| `/api/messages/transcribe` | POST | ElevenLabs Speech-to-Text audio transcription |
| `/api/messages?groupId=:id&since=:time` | GET | Realtime incremental group feed polling |
| `/api/groups` | GET / POST | List, create, or join broadcast groups |
| `/api/groups/:groupId` | GET | Group details, membership validation, and presence heartbeat |
| `/api/auth/demo-login` | POST | Switch live testing personas |
