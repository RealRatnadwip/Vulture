"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radio, Users, Activity, LogOut } from "lucide-react";

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
    <header className="sticky top-0 z-40 w-full border-b border-[#222222] bg-[#0e0e0e]/95 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded bg-[#181818] border border-[#2d2d2d] flex items-center justify-center group-hover:border-[#d7f24a]/50 transition-colors">
              <Radio className="w-3.5 h-3.5 text-[#d7f24a]" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-semibold tracking-wider text-[#f1f1ef] uppercase">
                VULTURE
              </span>
            </div>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/dashboard"
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                isCurrent("/dashboard")
                  ? "bg-[#1c1c1c] text-[#f1f1ef] font-medium"
                  : "text-[#888888] hover:text-[#f1f1ef] hover:bg-[#151515]"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Users className="w-3 h-3" />
                Groups
              </span>
            </Link>

            <Link
              href="/diagnostics"
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                pathname === "/diagnostics"
                  ? "bg-[#1c1c1c] text-[#f1f1ef] font-medium"
                  : "text-[#888888] hover:text-[#f1f1ef] hover:bg-[#151515]"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Activity className="w-3 h-3" />
                Diagnostics
              </span>
            </Link>
          </nav>
        </div>

        {/* Right side user / actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pl-2">
            <div className="w-6 h-6 rounded-full bg-[#202020] border border-[#333333] overflow-hidden flex items-center justify-center text-[10px] font-mono text-[#d7f24a]">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
              ) : (
                userName.slice(0, 1).toUpperCase()
              )}
            </div>
            <span className="hidden sm:inline text-xs text-[#cccccc] font-medium">{userName}</span>
          </div>

          <a
            href="/api/auth/logout"
            className="p-1.5 text-[#777777] hover:text-[#f1f1ef] hover:bg-[#1a1a1a] rounded transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
