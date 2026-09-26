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
    bio: "Making the PIGEON fly, and playing for Traffic.",
    image: "/members/img/member1.jpg",
    links: {
      github: "https://github.com/RealRatnadwip/",
      linkedin: "https://linkedin.com/in/realratnadwip",
      instagram: "https://instagram.com/myname_was_snatched",
    },
    tags: ["Core Pipeline", "Gemini 2.0", "Tiger Data"],
  },
  {
    id: "member2",
    name: "Ankita Aich",
    role: "Frontend Developer",
    handle: "@damn_ankita",
    bio: "",
    image: "/members/img/member2.png",
    links: {
      github: "https://github.com/ankitaaichhh29/",
      linkedin: "https://www.linkedin.com/in/ankita-aich-368993383/",
      instagram: "https://instagram.com/ankitaaichhh29/",
    },
    tags: ["Next.js 15", "React 19", "Audio UI"],
  },
  {
    id: "member3",
    name: "Debosmita Mukherjee",
    role: "Frontend Architech",
    handle: "@mukhrejeedcode",
    bio: "Behind the design ideology.",
    image: "/members/img/member3.png",
    links: {
      github: "https://github.com/mukherjeedcode/",
      linkedin: "https://www.linkedin.com/in/debosmita-mukherjee-a2aa36418/",
      instagram: "https://www.instagram.com/_debosmita_11",
    },
    tags: ["Drizzle ORM", "PostgreSQL", "Time Decay"],
  },
  {
    id: "member4",
    name: "Rikita Das",
    role: "QA Tester",
    handle: "@hexarikd",
    bio: "Real-life test",
    image: "/members/img/member4.png",
    links: {
      github: "https://github.com/hexarikd/",
      linkedin: "https://www.linkedin.com/in/rikita-das-a42a36418/",
      instagram: "https://www.instagram.com/_rikita_17/",
    },
    tags: ["Design System", "Editorial UX"],
  },
  {
    id: "member5",
    name: "Sayantica Ghosh",
    role: "QA Tester",
    handle: "@0xSayantica",
    bio: "Realiability",
    image: "/members/img/member5.png",
    links: {
      github: "https://github.com/0xsayantica",
      linkedin: "https://www.linkedin.com/in/sayantica-ghosh-10709b427/",
      instagram: "https://instagram.com/sayantica_ghosh_04/",
    },
    tags: ["Tiger Data", "Edge Infra"],
  }
];
