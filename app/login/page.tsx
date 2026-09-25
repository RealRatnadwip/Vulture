"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_USERS } from "@/lib/auth/demo-users";
import { Radio, ArrowRight, UserCheck, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<string>(DEMO_USERS[0].id);
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async (userId: string) => {
    setLoading(true);
    try {
      await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#f1f1ef] flex flex-col justify-center items-center p-4 selection:bg-[#d7f24a] selection:text-[#0e0e0e]">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-xl bg-[#141414] border border-[#242424] shadow-2xl">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#2e2e2e] flex items-center justify-center mb-3">
            <Radio className="w-5 h-5 text-[#d7f24a]" />
          </div>
          <h1 className="font-mono text-lg font-bold tracking-wider text-[#f1f1ef] uppercase">
            VULTURE
          </h1>
          <p className="text-xs text-[#888888] mt-1 font-mono">
            Voice-first group broadcasting
          </p>
        </div>

        {/* Demo Identity Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#222222]">
            <span className="text-xs font-mono text-[#888888] uppercase">
              Select Demo Identity
            </span>
            <span className="text-[10px] font-mono text-[#d7f24a] bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-[#282828]">
              DEMO_MODE=true
            </span>
          </div>

          <div className="space-y-2">
            {DEMO_USERS.map((user) => {
              const isSelected = selectedUserId === user.id;
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setSelectedUserId(user.id)}
                  className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? "bg-[#1b1b1b] border-[#d7f24a]/60 text-[#f1f1ef]"
                      : "bg-[#161616] border-[#222222] hover:border-[#333333] text-[#888888] hover:text-[#cccccc]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#202020] border border-[#303030] overflow-hidden flex items-center justify-center text-[10px] font-mono text-[#d7f24a]">
                      {user.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[#f1f1ef]">{user.name}</div>
                      <div className="text-[10px] text-[#666666] font-mono">{user.role}</div>
                    </div>
                  </div>

                  {isSelected ? (
                    <UserCheck className="w-4 h-4 text-[#d7f24a]" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-[#333333]" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleDemoLogin(selectedUserId)}
            className="w-full mt-4 py-2.5 px-4 rounded font-mono text-xs font-semibold uppercase tracking-wider bg-[#d7f24a] text-[#0e0e0e] hover:bg-[#c6e33b] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Enter as {DEMO_USERS.find((u) => u.id === selectedUserId)?.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Auth0 Note */}
        <div className="mt-6 pt-4 border-t border-[#1f1f1f] text-center">
          <p className="text-[11px] text-[#555555] font-mono leading-relaxed">
            In production mode with AUTH0_CLIENT_ID configured, standard Auth0 OAuth flow is invoked.
          </p>
        </div>
      </div>
    </div>
  );
}
