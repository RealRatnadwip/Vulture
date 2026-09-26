"use client";

import { useState } from "react";
import { TeamMember } from "@/lib/team";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import { ArrowUpRight } from "lucide-react";

interface TeamCardProps {
  member: TeamMember;
  className?: string;
}

export function TeamCard({ member, className = "" }: TeamCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`group relative rounded-2xl bg-[#0e1017]/90 border border-[#232738] hover:border-[#383e57] transition-all duration-300 p-5 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-[0_0_35px_rgba(212,246,91,0.1)] backdrop-blur-xl ${className}`}
    >
      {/* Subtle top indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4f65b]/0 to-transparent group-hover:via-[#d4f65b] transition-all duration-500" />

      <div>
        {/* Square Avatar Container */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#141622] border border-[#252a3d] mb-4 flex items-center justify-center">
          {member.image && !imageError ? (
            <img
              src={member.image}
              alt={member.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#12141e] text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#181b28] border border-[#2c3248] flex items-center justify-center text-xl font-mono font-bold text-[#d4f65b] mb-2 group-hover:border-[#d4f65b]/70 transition-colors shadow-sm">
                {member.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-[11px] font-mono text-[#64748b]">
                {member.name}
              </span>
            </div>
          )}

          {/* Role badge overlay on image */}
          <div className="absolute bottom-2 left-2 bg-[#090b10]/90 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-[#272c40] text-[10px] font-mono text-[#d4f65b] font-semibold">
            {member.handle}
          </div>
        </div>

        {/* Member Info */}
        <div className="space-y-1 mb-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-base font-bold text-[#f8f8f6] tracking-tight group-hover:text-[#ffffff] transition-colors">
              {member.name}
            </h3>
            <span className="w-2 h-2 rounded-full bg-[#d4f65b] opacity-80" />
          </div>
          <p className="text-xs text-[#ddd6fe] font-mono font-semibold">
            {member.role}
          </p>
        </div>

        {/* Bio */}
        {member.bio ? (
          <p className="text-xs text-[#94a3b8] leading-relaxed mb-4 font-sans">
            {member.bio}
          </p>
        ) : (
          <p className="text-xs text-[#64748b] italic leading-relaxed mb-4 font-mono">
            // Core creative contributor
          </p>
        )}

        {/* Tags with Bright Pastel Accents */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {member.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#141724] text-[#cbd5e1] border border-[#252a3c]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Social Icons */}
      <div className="flex items-center gap-2 pt-3 border-t border-[#1e2233]">
        {member.links.github && (
          <a
            href={member.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-[#141622] hover:bg-[#1c2030] text-[#94a3b8] hover:text-[#f8f8f6] border border-[#252a3c] flex items-center justify-center transition-colors"
            title="GitHub Profile"
          >
            <GithubIcon className="w-3.5 h-3.5" />
          </a>
        )}
        {member.links.linkedin && (
          <a
            href={member.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-[#141622] hover:bg-[#1c2030] text-[#94a3b8] hover:text-[#7dd3fc] border border-[#252a3c] flex items-center justify-center transition-colors"
            title="LinkedIn Profile"
          >
            <LinkedinIcon className="w-3.5 h-3.5" />
          </a>
        )}
        {member.links.instagram && (
          <a
            href={member.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-[#141622] hover:bg-[#1c2030] text-[#94a3b8] hover:text-[#fda4af] border border-[#252a3c] flex items-center justify-center transition-colors"
            title="Instagram Profile"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
