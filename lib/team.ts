export interface TeamMember {
  id: string;
  name: string;
  role: string;
  handle: string;
  bio: string;
  image: string;
  links: {
    github: string;
    linkedin: string;
    instagram: string;
  };
  tags: string[];
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "member1",
    name: "Ratnadwip Sarkar",
    role: "Lead Engineer / Fullstack & AI",
    handle: "@realratnadwip",
    bio: "Architected the voice pipeline and Gemini triage engine. Strongly believes typing during an incident is a design failure.",
    image: "/members/img/member1.jpg",
    links: {
      github: "https://github.com/RealRatnadwip",
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
    tags: ["Core Pipeline", "Gemini 2.0", "Tiger Data"],
  },
  {
    id: "member2",
    name: "Himanshu",
    role: "Frontend Architect & Interactions",
    handle: "@himanshu",
    bio: "Obsessed with 120fps micro-interactions, dark brutalist aesthetics, and audio waveform responsiveness.",
    image: "/members/img/member2.png",
    links: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
    tags: ["Next.js 15", "React 19", "Audio UI"],
  },
  {
    id: "member3",
    name: "Koushik",
    role: "Systems Specialist & Backend",
    handle: "@koushik",
    bio: "Maintains real-time database queries, presence heartbeats, and time-decay relevance calculation algorithms.",
    image: "/members/img/member3.png",
    links: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
    tags: ["Drizzle ORM", "PostgreSQL", "Time Decay"],
  },
  {
    id: "member4",
    name: "Ranit",
    role: "Product & Visual Design",
    handle: "@ranit",
    bio: "Designed Vulture's technical monospace identity, urgency visual hierarchy, and high-contrast editorial look.",
    image: "/members/img/member4.png",
    links: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
    tags: ["Design System", "Editorial UX", "Brutalism"],
  },
  {
    id: "member5",
    name: "Ranit",
    role: "Product & Visual Design",
    handle: "@ranit",
    bio: "Designed Vulture's technical monospace identity, urgency visual hierarchy, and high-contrast editorial look.",
    image: "/members/img/member4.png",
    links: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
    tags: ["Design System", "Editorial UX", "Brutalism"],
  }
];
