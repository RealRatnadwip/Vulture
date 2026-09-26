# The Problem It Solves

### The "Information Half-Life" Crisis
In modern team collaboration tools (Slack, Teams, Discord, WhatsApp), every message is treated with identical permanence and flat visual priority. An active database crash, a server failover alert, and a joke about lunch from three hours ago all occupy the same vertical channel space. As a result, critical operational feeds rapidly decay into cognitive noise, forcing on-call responders to manually sift through stale chatter to determine what is happening *right now*.

Furthermore, during active high-stakes incidents—production downtime, security threats, or emergency field operations—typing out detailed reports on a phone or laptop keyboard introduces dangerous friction and pulls focus away from mitigating the issue.

---

### What People Use VULTURE For
**VULTURE** is a voice-first tactical squad broadcasting system engineered for operational speed:
- **Incident Response & SRE Squads**: Speak for five seconds during an active infrastructure outage (*"Database pool saturated in us-east-1, failing over to replica"*). Responders stay hands-on while the squad receives an instant, prioritized briefing.
- **Security & Ops Teams**: Fast verbal dissemination of threat vectors or access lockouts without typing essays or context-switching between monitoring consoles.
- **Tactical Field & Engineering Syncs**: Ephemeral voice broadcasts and alerts that automatically self-decay after their window of relevance, eliminating channel clutter.

---

### How It Makes Tasks Faster, Easier, and Safer
1. **Zero-Typing Velocity**: Speaking is 4× faster than typing. By holding the mic for five seconds, ElevenLabs Scribe converts voice audio into an exact transcript with zero latency and zero friction.
2. **Autonomous Cognitive Triage**: Google Gemini 3.5 inspects channel history and spoken context to extract a 1-sentence executive summary, calculate an urgency score (0–100), and classify severity (`CRITICAL`, `HIGH`, `NORMAL`, `LOW`) automatically.
3. **Automatic Half-Life Decay**: Messages don't linger forever. Each broadcast glows vibrant when fresh, gradually dims over its assigned half-life (5m to 24h), and silently expires once resolved, keeping feeds actionable.
4. **Attention-Grabbing Tactile Alerts**: Critical incidents bypass notification blindness by triggering synchronized rhythmic haptic vibrations and perimeter screen flashes on responders' devices, ensuring emergencies cut through noise immediately.
