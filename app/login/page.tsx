import Link from "next/link";
import { isAuth0Configured, isDemoModeEnabled } from "@/lib/auth";
import { DemoUserSelector } from "@/components/auth/DemoUserSelector";
import { Radio, ShieldCheck, AlertCircle, ArrowRight, Lock } from "lucide-react";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const auth0Active = isAuth0Configured();
  const demoActive = isDemoModeEnabled();

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#f1f1ef] flex flex-col justify-center items-center p-4 selection:bg-[#d7f24a] selection:text-[#0e0e0e]">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-xl bg-[#141414] border border-[#242424] shadow-2xl">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-6">
          <Link href="/" className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#2e2e2e] flex items-center justify-center mb-3 hover:border-[#d7f24a] transition-colors">
            <Radio className="w-5 h-5 text-[#d7f24a]" />
          </Link>
          <h1 className="font-mono text-lg font-bold tracking-wider text-[#f1f1ef] uppercase">
            VULTURE
          </h1>
          <p className="text-xs text-[#888888] mt-1 font-mono">
            Voice-first group broadcasting
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[#261010] border border-[#4a1c1c] text-[#ff6b6b] text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Authentication failed: {error}</span>
          </div>
        )}

        {/* Mode 1: Real Auth0 Available */}
        {auth0Active && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#222222]">
              <span className="text-xs font-mono text-[#888888] uppercase">
                Production Authentication
              </span>
              <span className="text-[10px] font-mono text-[#34c759] bg-[#1a2e1d] px-1.5 py-0.5 rounded border border-[#26532d] flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5" />
                AUTH0 · READY
              </span>
            </div>

            <a
              href="/api/auth/login"
              className="w-full py-3 px-4 rounded font-mono text-xs font-bold uppercase tracking-wider bg-[#d7f24a] text-[#0e0e0e] hover:bg-[#c6e33b] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(215,242,74,0.15)]"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In with Auth0</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <p className="text-[11px] text-[#666666] font-mono text-center">
              Redirects to Auth0 Universal Login for secure OAuth / OIDC verification.
            </p>
          </div>
        )}

        {/* Separator if both Auth0 and Demo are active */}
        {auth0Active && demoActive && (
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#222222]" />
            </div>
            <span className="relative bg-[#141414] px-2 text-[10px] font-mono text-[#555555] uppercase">
              OR TEST DEMO PERSONAS
            </span>
          </div>
        )}

        {/* Mode 2: Demo Mode Active */}
        {demoActive && (
          <div className="space-y-4">
            {!auth0Active && (
              <div className="flex items-center justify-between pb-2 border-b border-[#222222]">
                <span className="text-xs font-mono text-[#888888] uppercase">
                  Select Demo Identity
                </span>
                <span className="text-[10px] font-mono text-[#d7f24a] bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-[#282828]">
                  DEMO_MODE=true
                </span>
              </div>
            )}

            <DemoUserSelector />
          </div>
        )}

        {/* Mode 3: Demo Mode explicitly disabled BUT Auth0 is unconfigured */}
        {!auth0Active && !demoActive && (
          <div className="p-4 rounded-lg bg-[#1a1a1a] border border-[#2c2c2c] text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#ff9f0a]">
              <AlertCircle className="w-4 h-4" />
              <span>AUTH0 CONFIGURATION REQUIRED</span>
            </div>
            <p className="text-xs text-[#888888] leading-relaxed">
              DEMO_MODE is set to <code className="text-[#d7f24a]">false</code>, but Auth0 credentials are missing.
            </p>
            <div className="p-3 bg-[#111111] rounded border border-[#222222] text-left text-[11px] font-mono text-[#777777] space-y-1">
              <div>AUTH0_SECRET=...</div>
              <div>AUTH0_CLIENT_ID=...</div>
              <div>AUTH0_ISSUER_BASE_URL=...</div>
            </div>
            <p className="text-[10px] text-[#555555] font-mono">
              Add these variables in your Vercel Project Settings → Environment Variables.
            </p>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-6 pt-4 border-t border-[#1f1f1f] text-center">
          <Link
            href="/"
            className="text-[11px] text-[#555555] hover:text-[#888888] font-mono transition-colors"
          >
            ← Back to Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
