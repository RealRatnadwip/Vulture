# VULTURE

```
    ___      ___ ___  ___  ___      _________ ___  ___  ________  _______      
   |\  \    /  /|\  \|\  \|\  \    |\___   ___\\  \|\  \|\   __  \|\  ___ \     
   \ \  \  /  / | \  \\\  \ \  \   \|___ \  \_\ \  \\\  \ \  \|\  \ \   __/|    
    \ \  \/  / / \ \  \\\  \ \  \       \ \  \ \ \  \\\  \ \   _  _\ \  \_|/__  
     \ \    / /   \ \  \\\  \ \  \____   \ \  \ \ \  \\\  \ \  \\  \\ \  \_|\ \ 
      \ \__/ /     \ \_______\ \_______\  \ \__\ \ \_______\ \__\\ _\\ \_______\
       \|__|/       \|_______|\|_______|   \|__|  \|_______|\|__|\|__|\|_______|
```

> **"Information has a half-life."**  
> Why does every team chat treat a 2-second server crash the same as a meme sent 4 hours ago?

VULTURE is a voice-first, time-aware broadcast feed built for small squads who move fast and hate chat bloat.

---

### the core problem

Modern communication tools are hoarders:
- **Zero urgency hierarchy**: "production DB down" looks visually identical to "who left coffee on the desk".
- **Zero time decay**: A message relevant for 10 minutes sits forever in the scrollback, cluttering context days later.
- **Typing friction**: Fast updates during incidents or transit get postponed because typing on a keyboard or phone takes too much friction.

---

### how vulture works

```
  [ HOLD MIC ] ──► speak for 5 seconds 
       │
       ▼
  [ ELEVENLABS ] ──► instant speech-to-text transcript
       │
       ▼
  [ GEMINI 2.0 ] ──► reads urgency, infers lifespan (5m to 24h)
       │
       ▼
  [ VULTURE FEED ] ──► high priority pins top · stale noise fades & decays
```

1. **Speak, Don't Type**: Tap the mic button. Say what happened. ElevenLabs converts your audio into clean text immediately.
2. **AI Urgency Triage**: Gemini analyzes urgency, tags the broadcast (`INCIDENT`, `STATUS`, `TASK`), assigns an urgency score (0–100), and calculates its half-life.
3. **Decaying Prominence**: Urgent broadcasts stay loud and pinned. Ephemeral updates ("stepping out for coffee") quietly fade and expire automatically.
4. **Zero-Noise Squad Radio**: No channel sprawl. Just live, breathing status signals with subtle audio waveforms and time-aware states.

---

### the stack

| layer | technology | purpose |
|---|---|---|
| **frontend** | Next.js 15 (App Router), React 19, TypeScript | Server components, instant navigation |
| **styling** | Tailwind CSS + Custom Design System | Dark brutalist minimalism (`#0E0E0E` + `#D7F24A`) |
| **voice** | ElevenLabs Speech-to-Text API | Push-to-talk audio transcription |
| **intelligence** | Google Gemini API (`gemini-2.0-flash`) | Contextual priority, urgency scoring & decay windows |
| **database** | Tiger Data PostgreSQL + Drizzle ORM | Persistent broadcasts, group tenancy, indexing |
| **auth** | Auth0 + Demo Personas | Production OAuth with one-click multi-user dev testing |

---

### quick peek

```bash
# clone & install
git clone https://github.com/RealRatnadwip/Vulture.git
cd Vulture
npm install

# copy env (runs immediately in demo mode — zero api keys required)
cp .env.example .env.local

# start vibe
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) to see the live feed, switch between team personas, and test live audio broadcasts.

---


*"Speak once. The feed sorts itself."*
