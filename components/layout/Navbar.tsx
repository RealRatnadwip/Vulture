"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radio, Users, LogOut, Terminal, Sparkles, ShieldCheck } from "lucide-react";

interface NavbarProps {
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
  isDemo?: boolean;
}

export function Navbar({ userName = "Ratnadwip", avatarUrl, isDemo = true }: NavbarProps) {
  const pathname = usePathname();

  const isCurrent = (path: string) => {
    if (path === "/dashboard" && (pathname === "/dashboard" || pathname.startsWith("/groups"))) return true;
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#212431]/80 bg-[#08090b]/85 backdrop-blur-xl transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
        {/* Brand & Telemetry Badge */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#12131b] border border-[#262a39] flex items-center justify-center group-hover:border-[#d4f65b]/70 shadow-sm transition-all group-hover:shadow-[0_0_15px_rgba(212,246,91,0.25)]">
              <Radio className="w-4 h-4 text-[#d4f65b]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-extrabold tracking-widest text-[#f8f8f6] uppercase">
                  VULTURE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4f65b] animate-ping hidden sm:inline-block" />
              </div>
            </div>
          </Link>

          {/* Telemetry Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#101218] border border-[#212433] text-[10px] font-mono text-[#94a3b8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#86efac]" />
            <span>ENCRYPTED PROTOCOL</span>
            <span className="text-[#3b4054]">·</span>
            <span className="text-[#d4f65b]">ONLINE</span>
          </div>
        </div>

        {/* Navigation links & User Area */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="flex items-center gap-1 sm:gap-1.5">
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
                isCurrent("/dashboard")
                  ? "bg-[#161822] text-[#d4f65b] font-semibold border border-[#2b3044]"
                  : "text-[#94a3b8] hover:text-[#f8f8f6] hover:bg-[#12141c]"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>CHANNELS</span>
            </Link>

            <Link
              href="/#team"
              className="px-3 py-1.5 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 text-[#94a3b8] hover:text-[#f8f8f6] hover:bg-[#12141c]"
            >
              <span className="text-[#ddd6fe]">CREW</span>
            </Link>
          </nav>

          <div className="h-4 w-px bg-[#232634] mx-1 hidden sm:block" />

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-1">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#12141c] border border-[#252837]">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-[#373b50]"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#1e2230] border border-[#30354b] flex items-center justify-center font-mono text-[10px] font-bold text-[#d4f65b]">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-xs font-mono font-medium text-[#e2e8f0] hidden sm:inline max-w-[100px] truncate">
                {userName}
              </span>
            </div>

            <Link
              href="/api/auth/logout"
              title="Sign Out"
              className="w-8 h-8 rounded-lg bg-[#12141c] hover:bg-[#1a1c27] text-[#94a3b8] hover:text-[#fda4af] border border-[#252837] flex items-center justify-center transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
