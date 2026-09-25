import Link from "next/link";
import { Radio, ArrowRight, Mic, ShieldAlert, Clock, Sparkles, Terminal, Users, Cpu, ArrowUpRight } from "lucide-react";
import { TEAM_MEMBERS } from "@/lib/team";
import { TeamCard } from "@/components/team/TeamCard";
import { TeamScroller } from "@/components/team/TeamScroller";
import { DecaySimulator } from "@/components/landing/DecaySimulator";
import { VoiceHeroDemo } from "@/components/landing/VoiceHeroDemo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#f1f1ef] flex flex-col justify-between selection:bg-[#d7f24a] selection:text-[#0e0e0e]">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0e0e0e]/85 border-b border-[#1c1c1c] px-6 h-14 flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-[#181818] border border-[#2b2b2b] flex items-center justify-center group-hover:border-[#d7f24a] transition-colors">
              <Radio className="w-3.5 h-3.5 text-[#d7f24a]" />
            </div>
            <span className="font-mono text-xs font-bold tracking-widest uppercase text-[#f1f1ef]">
              VULTURE
            </span>
          </Link>

          <span className="text-[10px] font-mono text-[#888888] bg-[#161616] px-2 py-0.5 rounded border border-[#222222] hidden sm:inline-block">
            v0.1 // voice-first
          </span>
        </div>

        <nav className="flex items-center gap-4 sm:gap-6">
          <a
            href="#concepts"
            className="text-xs font-mono text-[#888888] hover:text-[#f1f1ef] transition-colors hidden md:inline-block"
          >
            // CONCEPTS
          </a>
          <a
            href="#half-life"
            className="text-xs font-mono text-[#888888] hover:text-[#f1f1ef] transition-colors hidden md:inline-block"
          >
            // HALF-LIFE
          </a>
          <Link
            href="/team"
            className="text-xs font-mono text-[#888888] hover:text-[#f1f1ef] transition-colors flex items-center gap-1"
          >
            <span>// CREW</span>
          </Link>
          <Link
            href="/login"
            className="text-xs font-mono text-[#888888] hover:text-[#f1f1ef] transition-colors"
          >
            SIGN IN
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-mono font-semibold px-3 py-1.5 rounded bg-[#d7f24a] text-[#0e0e0e] hover:bg-[#c6e33b] transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(215,242,74,0.2)]"
          >
            <span>LIVE DEMO</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 sm:py-20 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151515] border border-[#252525] text-[11px] font-mono text-[#999999] mb-6">
          <span className="w-2 h-2 rounded-full bg-[#d7f24a] animate-pulse" />
          <span>VOICE-FIRST · TIME-AWARE SQUAD BROADCASTING</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-7xl font-mono font-extrabold tracking-tight text-[#f1f1ef] uppercase">
          VULTURE
        </h1>

        {/* Tagline */}
        <p className="mt-3 text-lg sm:text-2xl font-light text-[#a8a8a4] tracking-tight italic font-mono">
          &ldquo;information has a half-life.&rdquo;
        </p>

        {/* Human copy */}
        <p className="mt-6 text-sm sm:text-base text-[#888888] max-w-2xl mx-auto leading-relaxed font-sans">
          Why does every chat app treat a 2-second server crash the exact same as a meme sent 4 hours ago? 
          Speak once. VULTURE extracts the signal, ranks urgency, and lets stale noise decay silently.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase bg-[#d7f24a] text-[#0e0e0e] hover:bg-[#c6e33b] transition-all shadow-[0_0_25px_rgba(215,242,74,0.18)] flex items-center justify-center gap-2"
          >
            <span>OPEN SQUAD FEED</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/team"
            className="w-full sm:w-auto px-6 py-3.5 rounded-lg text-xs font-mono font-medium tracking-wider uppercase bg-[#161616] text-[#cccccc] hover:text-[#f1f1ef] hover:bg-[#1d1d1d] border border-[#282828] transition-all flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4 text-[#888888]" />
            <span>MEET THE CREW</span>
          </Link>
        </div>

        {/* Interactive Voice Pipeline Trigger Preview */}
        <div className="mt-12 w-full max-w-2xl">
          <VoiceHeroDemo />
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Core Concepts Grid */}
        {/* ------------------------------------------------------------- */}
        <div id="concepts" className="mt-24 w-full text-left pt-12 border-t border-[#1a1a1a]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#d7f24a] uppercase tracking-wider mb-1">
                <Terminal className="w-3.5 h-3.5" />
                <span>OVERALL CONCEPTS // CORE PRINCIPLES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-mono font-bold text-[#f1f1ef] uppercase">
                WHY VULTURE EXISTS
              </h2>
            </div>
            <span className="text-xs font-mono text-[#666666]">
              built for fast squads who hate notification fatigue
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Concept 1 */}
            <div className="p-6 rounded-xl bg-[#131313] border border-[#222222] hover:border-[#333333] transition-colors relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#181818] border border-[#2b2b2b] flex items-center justify-center text-[#d7f24a]">
                  <Mic className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono text-[#555555]">01 // VOICE</span>
              </div>
              <h3 className="font-mono text-sm font-bold text-[#f1f1ef] uppercase tracking-wide mb-2">
                ZERO-TYPING INERTIA
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                Typing essays on a phone or keyboard during an active outage breaks your focus. Hold the mic, speak for 5 seconds. 
                ElevenLabs converts spoken words into a clean, searchable transcript in milliseconds.
              </p>
            </div>

            {/* Concept 2 */}
            <div className="p-6 rounded-xl bg-[#131313] border border-[#222222] hover:border-[#333333] transition-colors relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#181818] border border-[#2b2b2b] flex items-center justify-center text-[#ff9f0a]">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono text-[#555555]">02 // TRIAGE</span>
              </div>
              <h3 className="font-mono text-sm font-bold text-[#f1f1ef] uppercase tracking-wide mb-2">
                GEMINI 2.0 CONTEXTUAL TRIAGE
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                No manual tag dropdowns or priority pickers. Gemini evaluates panic versus casual status, assigns an urgency score (0–100), 
                categorizes the broadcast (`INCIDENT`, `STATUS`, `TASK`), and dictates the half-life window.
              </p>
            </div>

            {/* Concept 3 */}
            <div className="p-6 rounded-xl bg-[#131313] border border-[#222222] hover:border-[#333333] transition-colors relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#181818] border border-[#2b2b2b] flex items-center justify-center text-[#64d2ff]">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono text-[#555555]">03 // DECAY</span>
              </div>
              <h3 className="font-mono text-sm font-bold text-[#f1f1ef] uppercase tracking-wide mb-2">
                INFORMATION HALF-LIFE
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                Static chats archive everything equally forever. VULTURE treats information as perishable. 
                High urgency stays pinned at top volume; expired messages quietly soften in opacity and yield space to what matters now.
              </p>
            </div>

            {/* Concept 4 */}
            <div className="p-6 rounded-xl bg-[#131313] border border-[#222222] hover:border-[#333333] transition-colors relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#181818] border border-[#2b2b2b] flex items-center justify-center text-[#d7f24a]">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono text-[#555555]">04 // SQUAD</span>
              </div>
              <h3 className="font-mono text-sm font-bold text-[#f1f1ef] uppercase tracking-wide mb-2">
                ASYNC WALKIE-TALKIE RADIO
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                Engineered for teams of 3 to 8 builders. No endless thread nesting, no channel explosion. 
                Just an ambient frequency where you stay in sync with zero meeting overhead.
              </p>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Interactive Half-Life Decay Simulator */}
        {/* ------------------------------------------------------------- */}
        <div id="half-life" className="mt-24 w-full text-left pt-12 border-t border-[#1a1a1a]">
          <DecaySimulator />
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Team Members Section */}
        {/* ------------------------------------------------------------- */}
        <div id="team" className="mt-24 w-full text-left pt-12 border-t border-[#1a1a1a]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#d7f24a] uppercase tracking-wider mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>MEET THE CREW // TEAM MANIFEST</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-mono font-bold text-[#f1f1ef] uppercase">
                THE MINDS BEHIND VULTURE
              </h2>
            </div>

            <Link
              href="/team"
              className="text-xs font-mono text-[#d7f24a] hover:underline flex items-center gap-1 group"
            >
              <span>VIEW FULL TEAM PAGE</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Side-Scrollable Team Cards */}
          <TeamScroller />
        </div>

        {/* Bottom Banner */}
        <div className="mt-20 w-full p-8 rounded-xl bg-gradient-to-b from-[#141414] to-[#0e0e0e] border border-[#242424] text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#1b1b1b] border border-[#2e2e2e] flex items-center justify-center text-[#d7f24a] mb-3">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="font-mono text-lg font-bold text-[#f1f1ef] uppercase">
            READY TO DITCH CHAT NOISE?
          </h3>
          <p className="text-xs text-[#888888] font-mono mt-1 max-w-md">
            Test the live feed in demo mode with one click. Pre-seeded voice scenarios, multi-persona testing, and zero setup required.
          </p>

          <Link
            href="/dashboard"
            className="mt-6 px-6 py-3 rounded-lg font-mono text-xs font-bold uppercase tracking-wider bg-[#d7f24a] text-[#0e0e0e] hover:bg-[#c6e33b] transition-all shadow-[0_0_20px_rgba(215,242,74,0.15)] flex items-center gap-2"
          >
            <span>LAUNCH SQUAD BROADCASTING</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-8 px-6 max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#555555]">
        <div>
          <span>VULTURE</span> · <span>VOICE-FIRST, TIME-AWARE BROADCASTING</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/team" className="hover:text-[#d7f24a] transition-colors">crew</Link>
          <span>·</span>
          <Link href="/dashboard" className="hover:text-[#f1f1ef] transition-colors">feed</Link>
          <span>·</span>
          <Link href="/login" className="hover:text-[#f1f1ef] transition-colors">login</Link>
          <span>·</span>
          <Link href="/diagnostics" className="hover:text-[#f1f1ef] transition-colors">diagnostics</Link>
        </div>
      </footer>
    </div>
  );
}
