"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_USERS } from "@/lib/auth/demo-users";
import { UserCheck, ArrowRight, Loader2 } from "lucide-react";

export function DemoUserSelector() {
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
    <div className="space-y-3">
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
        className="w-full mt-2 py-2.5 px-4 rounded font-mono text-xs font-semibold uppercase tracking-wider bg-[#d7f24a] text-[#0e0e0e] hover:bg-[#c6e33b] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
  );
}
