import Link from "next/link";
import {
  Radio,
  ArrowRight,
  Mic,
  ShieldAlert,
  Clock,
  Sparkles,
  Terminal,
  Users,
  Cpu,
  ArrowUpRight,
  Zap,
  Activity,
  Layers,
} from "lucide-react";
import { TEAM_MEMBERS } from "@/lib/team";
import { TeamCard } from "@/components/team/TeamCard";
import { TeamScroller } from "@/components/team/TeamScroller";
import { DecaySimulator } from "@/components/landing/DecaySimulator";
import { VoiceHeroDemo } from "@/components/landing/VoiceHeroDemo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#08090b] text-[#f8f8f6] flex flex-col justify-between selection:bg-[#d4f65b] selection:text-[#08090b]">
      {/* Top Floating Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#08090b]/80 border-b border-[#212431]/80 px-4 sm:px-6 h-15 flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#12131b] border border-[#272b3c] flex items-center justify-center group-hover:border-[#d4f65b]/70 transition-all shadow-sm">
              <Radio className="w-4 h-4 text-[#d4f65b]" />
            </div>
            <span className="font-mono text-xs font-extrabold tracking-widest uppercase text-[#f8f8f6]">
              VULTURE
            </span>
          </Link>

          <span className="text-[10px] font-mono text-[#94a3b8] bg-[#12141c] px-2.5 py-0.5 rounded-full border border-[#222533] hidden sm:inline-block">
            v0.1 // voice-first intelligence
          </span>
        </div>

        <nav className="flex items-center gap-3 sm:gap-5">
          <a
            href="#concepts"
            className="text-xs font-mono text-[#94a3b8] hover:text-[#f8f8f6] transition-colors hidden md:inline-block"
          >
            // ARCHITECTURE
          </a>
          <a
            href="#half-life"
            className="text-xs font-mono text-[#94a3b8] hover:text-[#f8f8f6] transition-colors hidden md:inline-block"
          >
            // HALF-LIFE
          </a>
          <a
            href="#team"
            className="text-xs font-mono text-[#ddd6fe] hover:text-[#f8f8f6] transition-colors flex items-center gap-1"
          >
            <span>// CREW</span>
          </a>
          <Link
            href="/login"
            className="text-xs font-mono text-[#94a3b8] hover:text-[#f8f8f6] transition-colors"
          >
            SIGN IN
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-mono font-bold px-3.5 py-1.5 rounded-lg bg-[#d4f65b] text-[#08090b] hover:bg-[#c3e848] transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(212,246,91,0.22)]"
          >
            <span>LAUNCH SQUAD</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center text-center">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12141d] border border-[#24283b] text-xs font-mono text-[#94a3b8] mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#d4f65b] animate-ping" />
          <span className="text-[#f8f8f6] font-medium">VOICE-FIRST PROTOCOL</span>
          <span className="text-[#3b4054]">·</span>
          <span className="text-[#86efac]">TIME-AWARE RELEVANCE</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-7xl lg:text-8xl font-mono font-black tracking-tight text-[#f8f8f6] uppercase max-w-5xl leading-none">
          INFORMATION HAS A HALF-LIFE.
        </h1>

        {/* Human Narrative */}
        <p className="mt-6 text-base sm:text-lg text-[#94a3b8] max-w-2xl mx-auto leading-relaxed font-sans">
          Why does modern team software treat an active production server crash the exact same as lunch banter from 3 hours ago? 
          <span className="text-[#f8f8f6] font-medium block mt-2">
            Speak once. VULTURE extracts the signal, ranks urgency with Gemini, and lets stale noise decay silently.
          </span>
        </p>

        {/* High-Polish CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase bg-[#d4f65b] text-[#08090b] hover:bg-[#c3e848] transition-all shadow-[0_0_30px_rgba(212,246,91,0.25)] flex items-center justify-center gap-2"
          >
            <span>ENTER SQUAD TERMINAL</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#team"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-xs font-mono font-semibold tracking-wider uppercase bg-[#12141e] text-[#cbd5e1] hover:text-[#f8f8f6] hover:bg-[#181a27] border border-[#272b3c] transition-all flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4 text-[#ddd6fe]" />
            <span>MEET THE CREW</span>
          </a>
        </div>

        {/* Live Interactive Voice Pipeline Hero Demo */}
        <div className="mt-12 sm:mt-16 w-full max-w-3xl">
          <VoiceHeroDemo />
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Core Principles Architecture Grid */}
        {/* ------------------------------------------------------------- */}
        <section id="concepts" className="mt-28 w-full text-left pt-14 border-t border-[#1d202d]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#d4f65b] uppercase tracking-wider mb-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>ARCHITECTURAL CORE // 4 PILLARS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-mono font-extrabold text-[#f8f8f6] uppercase tracking-tight">
                BUILT FOR FAST SQUADS
              </h2>
            </div>
            <span className="text-xs font-mono text-[#64748b]">
              engineered for high-stakes operational velocity
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Concept 1 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0f1118] border border-[#222534] hover:border-[#2f3448] transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#161823] border border-[#2c3044] flex items-center justify-center text-[#d4f65b] shadow-sm">
                  <Mic className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-[#64748b] bg-[#12141c] px-2.5 py-1 rounded-full border border-[#212433]">
                  01 // VOICE
                </span>
              </div>
              <h3 className="font-mono text-base font-bold text-[#f8f8f6] uppercase tracking-wide mb-2 flex items-center gap-2">
                <span>ZERO-TYPING INERTIA</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4f65b]" />
              </h3>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed font-sans">
                Typing essays on a phone or keyboard during an active outage breaks focus. Hold the mic, speak for 5 seconds. 
                ElevenLabs Scribe extracts tokens into an exact, searchable transcript in milliseconds.
              </p>
            </div>

            {/* Concept 2 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0f1118] border border-[#222534] hover:border-[#2f3448] transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#161823] border border-[#2c3044] flex items-center justify-center text-[#ddd6fe] shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-[#64748b] bg-[#12141c] px-2.5 py-1 rounded-full border border-[#212433]">
                  02 // AI TRIAGE
                </span>
              </div>
              <h3 className="font-mono text-base font-bold text-[#f8f8f6] uppercase tracking-wide mb-2 flex items-center gap-2">
                <span>GEMINI CONTEXTUAL HARVESTER</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ddd6fe]" />
              </h3>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed font-sans">
                Raw audio is noisy. Google Gemini 3.5 inspects recent channel context to infer priority, distill a 1-sentence briefing, 
                and assign a dynamic decay window from 5 to 1,440 minutes.
              </p>
            </div>

            {/* Concept 3 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0f1118] border border-[#222534] hover:border-[#2f3448] transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#161823] border border-[#2c3044] flex items-center justify-center text-[#fdba74] shadow-sm">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-[#64748b] bg-[#12141c] px-2.5 py-1 rounded-full border border-[#212433]">
                  03 // HALF-LIFE
                </span>
              </div>
              <h3 className="font-mono text-base font-bold text-[#f8f8f6] uppercase tracking-wide mb-2 flex items-center gap-2">
                <span>AUTOMATIC DECAY CURVE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#fdba74]" />
              </h3>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed font-sans">
                Messages don&apos;t clog channels permanently. Broadcasts glow bright when fresh, gradually dim over their half-life, 
                and expire silently so your feed remains uncluttered.
              </p>
            </div>

            {/* Concept 4 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0f1118] border border-[#222534] hover:border-[#2f3448] transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#161823] border border-[#2c3044] flex items-center justify-center text-[#7dd3fc] shadow-sm">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-[#64748b] bg-[#12141c] px-2.5 py-1 rounded-full border border-[#212433]">
                  04 // HAPTICS
                </span>
              </div>
              <h3 className="font-mono text-base font-bold text-[#f8f8f6] uppercase tracking-wide mb-2 flex items-center gap-2">
                <span>TACTILE & SCREEN OVERLAY</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#7dd3fc]" />
              </h3>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed font-sans">
                Critical alerts command attention. When emergencies strike, VULTURE triggers synchronized rhythmic haptic vibration patterns 
                and full-screen perimeter strobe flashes on your Android phone.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* Interactive Temporal Decay Simulator */}
        {/* ------------------------------------------------------------- */}
        <section id="half-life" className="mt-24 w-full text-left">
          <DecaySimulator />
        </section>

        {/* ------------------------------------------------------------- */}
        {/* ------------------------------------------------------------- */}
        {/* Crew / Creative Collective Section */}
        {/* ------------------------------------------------------------- */}
        <section id="team" className="mt-28 w-full text-left scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#ddd6fe] uppercase tracking-wider mb-1.5">
                <Users className="w-3.5 h-3.5 text-[#ddd6fe]" />
                <span>THE BUILDERS // CREATIVE MANIFEST</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-mono font-extrabold text-[#f8f8f6] uppercase tracking-tight">
                MEET THE CREW
              </h2>
            </div>
            <p className="text-xs font-mono text-[#94a3b8] max-w-sm">
              The cross-functional engineers and architects pioneering voice-first emergency squad broadcasting.
            </p>
          </div>

          {/* Full Grid of Team Members */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEAM_MEMBERS.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </section>

        {/* Bottom Banner */}
        <div className="mt-28 w-full p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-[#12141e] via-[#0d0f15] to-[#090a0d] border border-[#24283b] flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-[#171a27] border border-[#2f354c] flex items-center justify-center text-[#d4f65b] mb-4 shadow-lg shadow-[#d4f65b]/10">
            <Radio className="w-6 h-6" />
          </div>
          <h3 className="font-mono text-xl sm:text-3xl font-extrabold uppercase text-[#f8f8f6] tracking-tight">
            START BROADCASTING WITH YOUR SQUAD
          </h3>
          <p className="text-xs sm:text-sm text-[#94a3b8] max-w-md mt-2 font-mono">
            Zero setup inertia. Create a channel, share an encrypted invite code, and experience time-aware voice triage.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 px-7 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#d4f65b] text-[#08090b] hover:bg-[#c3e848] transition-all shadow-[0_0_30px_rgba(212,246,91,0.25)] flex items-center gap-2"
          >
            <span>LAUNCH SQUAD TERMINAL</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1d202d] py-8 px-6 max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#64748b]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#d4f65b]" />
          <span>VULTURE // PROTOCOL v0.1</span>
        </div>
        <p>Built with Tiger Data PostgreSQL · Next.js · ElevenLabs · Google Gemini</p>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:text-[#f8f8f6] transition-colors">
            TERMINAL
          </Link>
          <a href="#team" className="hover:text-[#f8f8f6] transition-colors">
            CREW
          </a>
          <Link href="/diagnostics" className="hover:text-[#f8f8f6] transition-colors">
            TELEMETRY
          </Link>
        </div>
      </footer>
    </div>
  );
}
