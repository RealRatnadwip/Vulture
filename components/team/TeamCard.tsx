"use client";

import { useState } from "react";
import Image from "next/image";
import { TeamMember } from "@/lib/team";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import { ArrowUpRight } from "lucide-react";

interface TeamCardProps {
  member: TeamMember;
}

export function TeamCard({ member }: TeamCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative rounded-xl bg-[#131313] border border-[#222222] hover:border-[#383838] transition-all duration-300 p-5 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(215,242,74,0.06)]">
      {/* Subtle top indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d7f24a]/0 to-transparent group-hover:via-[#d7f24a]/80 transition-all duration-500" />

      <div>
        {/* Square Avatar Container */}
        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#181818] border border-[#242424] mb-4 flex items-center justify-center">
          {!imageError ? (
            <img
              src={member.image}
              alt={member.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#161616] text-center">
              <div className="w-16 h-16 rounded-full bg-[#1f1f1f] border border-[#333333] flex items-center justify-center text-xl font-mono font-bold text-[#d7f24a] mb-2 group-hover:border-[#d7f24a] transition-colors">
                {member.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-[11px] font-mono text-[#666666]">
                {member.image}
              </span>
            </div>
          )}

          {/* Role badge overlay on image */}
          <div className="absolute bottom-2 left-2 bg-[#0e0e0e]/85 backdrop-blur-md px-2 py-0.5 rounded border border-[#2b2b2b] text-[10px] font-mono text-[#d7f24a]">
            {member.handle}
          </div>
        </div>

        {/* Member Info */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-base font-bold text-[#f1f1ef] tracking-tight group-hover:text-[#ffffff] transition-colors">
              {member.name}
            </h3>
            <span className="w-2 h-2 rounded-full bg-[#d7f24a] opacity-80" />
          </div>
          <p className="text-xs text-[#a1a19f] font-mono font-medium">
            {member.role}
          </p>
        </div>

        {/* Bio */}
        <p className="text-xs text-[#787878] leading-relaxed mb-4">
          {member.bio}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {member.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1a1a1a] text-[#8e8e8e] border border-[#252525]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 3 Link Icons: GitHub, LinkedIn, Instagram */}
      <div className="pt-3 border-t border-[#1e1e1e] flex items-center justify-between">
        <span className="text-[10px] font-mono text-[#555555] uppercase tracking-wider">
          CONNECT
        </span>

        <div className="flex items-center gap-2">
          {/* GitHub */}
          <a
            href={member.links.github}
            target="_blank"
            rel="noopener noreferrer"
            title={`${member.name} on GitHub`}
            className="w-8 h-8 rounded-lg bg-[#181818] border border-[#282828] hover:border-[#d7f24a] hover:bg-[#202020] text-[#888888] hover:text-[#d7f24a] transition-all flex items-center justify-center group/btn"
          >
            <GithubIcon className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
          </a>

          {/* LinkedIn */}
          <a
            href={member.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            title={`${member.name} on LinkedIn`}
            className="w-8 h-8 rounded-lg bg-[#181818] border border-[#282828] hover:border-[#d7f24a] hover:bg-[#202020] text-[#888888] hover:text-[#d7f24a] transition-all flex items-center justify-center group/btn"
          >
            <LinkedinIcon className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
          </a>

          {/* Instagram */}
          <a
            href={member.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            title={`${member.name} on Instagram`}
            className="w-8 h-8 rounded-lg bg-[#181818] border border-[#282828] hover:border-[#d7f24a] hover:bg-[#202020] text-[#888888] hover:text-[#d7f24a] transition-all flex items-center justify-center group/btn"
          >
            <InstagramIcon className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
          </a>
        </div>
      </div>
    </div>
  );
}
