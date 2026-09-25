export interface DemoUser {
  id: string;
  auth0Id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: "usr_ratnadwip",
    auth0Id: "auth0|demo_ratnadwip",
    name: "Ratnadwip",
    email: "ratnadwip@vulture.internal",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Ratnadwip&backgroundColor=151515",
    role: "Lead Engineer",
  },
  {
    id: "usr_himanshu",
    auth0Id: "auth0|demo_himanshu",
    name: "Himanshu",
    email: "himanshu@vulture.internal",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Himanshu&backgroundColor=151515",
    role: "Frontend Architect",
  },
  {
    id: "usr_koushik",
    auth0Id: "auth0|demo_koushik",
    name: "Koushik",
    email: "koushik@vulture.internal",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Koushik&backgroundColor=151515",
    role: "Systems Specialist",
  },
  {
    id: "usr_ranit",
    auth0Id: "auth0|demo_ranit",
    name: "Ranit",
    email: "ranit@vulture.internal",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Ranit&backgroundColor=151515",
    role: "Product Designer",
  },
];

export const DEFAULT_DEMO_USER = DEMO_USERS[0];

export function getDemoUserById(id: string): DemoUser {
  return DEMO_USERS.find((u) => u.id === id || u.auth0Id === id) || DEFAULT_DEMO_USER;
}
