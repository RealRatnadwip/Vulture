import "./load-env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, desc, and, gt } from "drizzle-orm";
import * as schema from "@/drizzle/schema";
import { DEMO_USERS, DEFAULT_DEMO_USER } from "@/lib/auth/demo-users";

export type MessageWithSender = schema.Message & {
  sender: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
};

export type Group = schema.Group;
export type User = schema.User;
export type Message = schema.Message;


const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/vulture";
const isDemoMode = process.env.DEMO_MODE === "true";

const isCloudDb =
  connectionString.includes("timescale.com") ||
  connectionString.includes("neon.tech") ||
  connectionString.includes("sslmode=require");

// Global postgres client singleton
let sql: ReturnType<typeof postgres> | null = null;
let db: ReturnType<typeof drizzle> | null = null;

try {
  sql = postgres(connectionString, {
    max: process.env.VERCEL ? 3 : 10,
    idle_timeout: 30,
    connect_timeout: 15,
    max_lifetime: 60 * 30,
    ssl: isCloudDb ? { rejectUnauthorized: false } : undefined,
    onnotice: () => {},
  });
  db = drizzle(sql, { schema });
} catch {
  console.warn("[Database] Could not create postgres client, relying on fallback.");
}

export { db, sql };

// In-Memory Fallback State (Active only when PostgreSQL is unreachable & DEMO_MODE=true)
interface MemoryStore {
  users: Map<string, schema.User>;
  groups: Map<string, schema.Group>;
  members: Map<string, schema.GroupMember>; // key: `${groupId}_${userId}`
  messages: Map<string, schema.Message>;
}

const memoryStore: MemoryStore = {
  users: new Map(),
  groups: new Map(),
  members: new Map(),
  messages: new Map(),
};

// Seed in-memory store with demo data immediately
function initDemoMemoryStore() {
  if (memoryStore.groups.size > 0) return;

  // Demo users
  for (const u of DEMO_USERS) {
    memoryStore.users.set(u.id, {
      id: u.id,
      auth0Id: u.auth0Id,
      name: u.name,
      email: u.email,
      avatarUrl: u.avatarUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Demo groups
  const demoGroup: schema.Group = {
    id: "grp_hackathon",
    name: "HACKATHON",
    inviteCode: "HACK-2026",
    createdAt: new Date(Date.now() - 3600 * 1000 * 24),
    updatedAt: new Date(),
  };
  memoryStore.groups.set(demoGroup.id, demoGroup);

  const trafficGroup: schema.Group = {
    id: "grp_traffic",
    name: "TRAFFIC",
    inviteCode: "TRF-900",
    createdAt: new Date(Date.now() - 3600 * 1000 * 48),
    updatedAt: new Date(),
  };
  memoryStore.groups.set(trafficGroup.id, trafficGroup);

  const projectXGroup: schema.Group = {
    id: "grp_projectx",
    name: "PROJECT X",
    inviteCode: "PRJX-44",
    createdAt: new Date(Date.now() - 3600 * 1000 * 72),
    updatedAt: new Date(),
  };
  memoryStore.groups.set(projectXGroup.id, projectXGroup);

  // Group memberships
  for (const u of DEMO_USERS) {
    memoryStore.members.set(`${demoGroup.id}_${u.id}`, {
      id: `mem_${demoGroup.id}_${u.id}`,
      groupId: demoGroup.id,
      userId: u.id,
      joinedAt: new Date(Date.now() - 3600 * 1000 * 12),
      lastSeenAt: new Date(),
    });
    // Add to project X
    if (u.id === "usr_ratnadwip" || u.id === "usr_himanshu") {
      memoryStore.members.set(`${projectXGroup.id}_${u.id}`, {
        id: `mem_${projectXGroup.id}_${u.id}`,
        groupId: projectXGroup.id,
        userId: u.id,
        joinedAt: new Date(Date.now() - 3600 * 1000 * 24),
        lastSeenAt: new Date(),
      });
    }
  }

  // Seed realistic messages from Section 29
  const now = Date.now();
  const seedMsgs: Array<Omit<schema.Message, "createdAt" | "expiresAt"> & { createdAt: Date; expiresAt: Date }> = [
    {
      id: "msg_1",
      groupId: demoGroup.id,
      senderId: "usr_ratnadwip",
      transcript: "Guys, the backend server is down. Don't deploy anything until it's back.",
      summary: "Backend server is down. Freeze deployments.",
      priority: "CRITICAL",
      category: "INCIDENT",
      urgencyScore: 98,
      durationMs: 4200,
      processingStatus: "READY",
      createdAt: new Date(now - 1000 * 60 * 3), // 3 mins ago
      expiresAt: new Date(now + 1000 * 60 * 27), // expires in 27 mins
    },
    {
      id: "msg_2",
      groupId: demoGroup.id,
      senderId: "usr_himanshu",
      transcript: "I've pushed the latest frontend build. Let me know if you hit any UI bugs.",
      summary: "Pushed latest frontend build.",
      priority: "NORMAL",
      category: "STATUS",
      urgencyScore: 45,
      durationMs: 3800,
      processingStatus: "READY",
      createdAt: new Date(now - 1000 * 60 * 12), // 12 mins ago
      expiresAt: new Date(now + 1000 * 60 * 168),
    },
    {
      id: "msg_3",
      groupId: demoGroup.id,
      senderId: "usr_koushik",
      transcript: "The project presentation has been scheduled for 5 PM sharp.",
      summary: "Presentation is at 5 PM.",
      priority: "HIGH",
      category: "SCHEDULE",
      urgencyScore: 82,
      durationMs: 3100,
      processingStatus: "READY",
      createdAt: new Date(now - 1000 * 60 * 25), // 25 mins ago
      expiresAt: new Date(now + 1000 * 60 * 95),
    },
    {
      id: "msg_4",
      groupId: demoGroup.id,
      senderId: "usr_ranit",
      transcript: "Can someone check the database connection? The pool seems saturated.",
      summary: "Check database connection pool.",
      priority: "HIGH",
      category: "TASK",
      urgencyScore: 79,
      durationMs: 3600,
      processingStatus: "READY",
      createdAt: new Date(now - 1000 * 60 * 40), // 40 mins ago
      expiresAt: new Date(now + 1000 * 60 * 80),
    },
    {
      id: "msg_5",
      groupId: demoGroup.id,
      senderId: "usr_koushik",
      transcript: "I'll join the sync in about ten minutes, stepping away briefly.",
      summary: "Joining in 10 minutes.",
      priority: "LOW",
      category: "STATUS",
      urgencyScore: 20,
      durationMs: 2500,
      processingStatus: "READY",
      createdAt: new Date(now - 1000 * 60 * 55), // 55 mins ago
      expiresAt: new Date(now - 1000 * 60 * 10), // already expired! Demonstrates expiry UI
    },
  ];

  for (const m of seedMsgs) {
    memoryStore.messages.set(m.id, m);
  }
}

initDemoMemoryStore();

let isDbReachable: boolean | null = null;
let lastDbCheckTime = 0;
const DB_CHECK_INTERVAL_MS = 30000; // 30 seconds circuit breaker

export async function checkDatabaseHealth(): Promise<{ ok: boolean; type: "postgres" | "demo-memory"; error?: string }> {
  if (!sql) {
    return { ok: true, type: "demo-memory", error: "Database client not configured." };
  }

  const now = Date.now();
  // Circuit breaker: If we recently verified that DB is unreachable, return immediately without blocking!
  if (isDbReachable === false && now - lastDbCheckTime < DB_CHECK_INTERVAL_MS) {
    return { ok: true, type: "demo-memory", error: "Postgres unreachable (cached circuit breaker)" };
  }

  // If we recently verified that DB is reachable, reuse healthy status
  if (isDbReachable === true && now - lastDbCheckTime < DB_CHECK_INTERVAL_MS) {
    return { ok: true, type: "postgres" };
  }

  try {
    lastDbCheckTime = now;
    await sql`SELECT 1 as ping`;
    isDbReachable = true;
    return { ok: true, type: "postgres" };
  } catch (err: unknown) {
    isDbReachable = false;
    lastDbCheckTime = now;
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(`[Database] PostgreSQL unreachable (${errorMsg}). Operating in resilient in-memory store.`);
    return { ok: true, type: "demo-memory", error: errorMsg };
  }
}

// Data Access Layer

export async function getUserById(id: string): Promise<schema.User | null> {
  const health = await checkDatabaseHealth();
  if (health.type === "postgres" && db) {
    try {
      const rows = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
      return rows[0] || null;
    } catch (err) {
      console.warn("[db] postgres getUserById error:", err);
    }
  }
  return memoryStore.users.get(id) || null;
}

export async function getUserByAuth0Id(auth0Id: string): Promise<schema.User | null> {
  const health = await checkDatabaseHealth();
  if (health.type === "postgres" && db) {
    try {
      const rows = await db.select().from(schema.users).where(eq(schema.users.auth0Id, auth0Id)).limit(1);
      return rows[0] || null;
    } catch (err) {
      console.warn("[db] postgres getUserByAuth0Id error:", err);
    }
  }
  for (const u of memoryStore.users.values()) {
    if (u.auth0Id === auth0Id) return u;
  }
  return null;
}

export async function upsertUser(user: schema.NewUser): Promise<schema.User> {
  const health = await checkDatabaseHealth();
  if (health.type === "postgres" && db) {
    try {
      const rows = await db
        .insert(schema.users)
        .values(user)
        .onConflictDoUpdate({
          target: schema.users.auth0Id,
          set: {
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            updatedAt: new Date(),
          },
        })
        .returning();
      return rows[0];
    } catch (err) {
      console.warn("[db] postgres upsertUser error:", err);
    }
  }

  const existing = await getUserByAuth0Id(user.auth0Id);
  const now = new Date();
  const savedUser: schema.User = {
    id: existing ? existing.id : user.id,
    auth0Id: user.auth0Id,
    name: user.name,
    email: user.email || null,
    avatarUrl: user.avatarUrl || null,
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now,
  };
  memoryStore.users.set(savedUser.id, savedUser);
  return savedUser;
}

export async function verifyGroupMembership(groupId: string, userId: string): Promise<boolean> {
  const health = await checkDatabaseHealth();
  if (health.type === "postgres" && db) {
    try {
      const rows = await db
        .select()
        .from(schema.groupMembers)
        .where(and(eq(schema.groupMembers.groupId, groupId), eq(schema.groupMembers.userId, userId)))
        .limit(1);
      if (rows.length > 0) return true;
    } catch (err) {
      console.warn("[db] postgres verifyGroupMembership error:", err);
    }
  }
  return memoryStore.members.has(`${groupId}_${userId}`);
}

export async function listUserGroups(userId: string): Promise<Array<schema.Group & { memberCount: number; onlineCount: number }>> {
  const health = await checkDatabaseHealth();
  if (health.type === "postgres" && db) {
    try {
      const memberRows = await db
        .select({
          groupId: schema.groupMembers.groupId,
        })
        .from(schema.groupMembers)
        .where(eq(schema.groupMembers.userId, userId));

      const groupIds = memberRows.map((m) => m.groupId);

      const groupList = groupIds.length > 0 ? await db.select().from(schema.groups) : [];
      const results: Array<schema.Group & { memberCount: number; onlineCount: number }> = [];

      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      for (const g of groupList) {
        if (!groupIds.includes(g.id)) continue;
        const allMembers = await db
          .select()
          .from(schema.groupMembers)
          .where(eq(schema.groupMembers.groupId, g.id));
        const online = allMembers.filter((m) => m.lastSeenAt && m.lastSeenAt >= fiveMinutesAgo).length;
        results.push({
          ...g,
          memberCount: allMembers.length,
          onlineCount: Math.max(1, online),
        });
      }

      // Check if user also has any groups created in memory store and merge them
      for (const group of memoryStore.groups.values()) {
        if (results.some((r) => r.id === group.id)) continue;
        if (memoryStore.members.has(`${group.id}_${userId}`)) {
          results.push({
            ...group,
            memberCount: 1,
            onlineCount: 1,
          });
        }
      }

      return results;
    } catch (err) {
      console.warn("[db] postgres listUserGroups error:", err);
    }
  }

  // Memory fallback
  const results: Array<schema.Group & { memberCount: number; onlineCount: number }> = [];
  for (const group of memoryStore.groups.values()) {
    const isMember = memoryStore.members.has(`${group.id}_${userId}`);
    if (isMember) {
      let memberCount = 0;
      let onlineCount = 0;
      const fiveMinsAgo = Date.now() - 5 * 60 * 1000;
      for (const mem of memoryStore.members.values()) {
        if (mem.groupId === group.id) {
          memberCount++;
          if (new Date(mem.lastSeenAt).getTime() >= fiveMinsAgo) {
            onlineCount++;
          }
        }
      }
      results.push({
        ...group,
        memberCount: Math.max(memberCount, 1),
        onlineCount: Math.max(onlineCount, 1),
      });
    }
  }
  return results;
}

export async function getGroupById(groupId: string): Promise<schema.Group | null> {
  const health = await checkDatabaseHealth();
  if (health.type === "postgres" && db) {
    try {
      const rows = await db.select().from(schema.groups).where(eq(schema.groups.id, groupId)).limit(1);
      if (rows[0]) return rows[0];
    } catch (err) {
      console.warn("[db] postgres getGroupById error:", err);
    }
  }
  return memoryStore.groups.get(groupId) || null;
}

export async function getGroupByInviteCode(inviteCode: string): Promise<schema.Group | null> {
  const code = inviteCode.trim().toUpperCase();
  const health = await checkDatabaseHealth();
  if (health.type === "postgres" && db) {
    try {
      const rows = await db.select().from(schema.groups).where(eq(schema.groups.inviteCode, code)).limit(1);
      if (rows[0]) return rows[0];
    } catch (err) {
      console.warn("[db] postgres getGroupByInviteCode error:", err);
    }
  }
  for (const g of memoryStore.groups.values()) {
    if (g.inviteCode.toUpperCase() === code) return g;
  }
  return null;
}

export async function createGroup(
  name: string,
  inviteCode: string,
  creatorUserId: string,
  creatorUser?: { id: string; name?: string; email?: string | null; avatarUrl?: string | null; auth0Id?: string }
): Promise<schema.Group> {
  const id = `grp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const code = inviteCode.trim().toUpperCase();
  const health = await checkDatabaseHealth();

  if (health.type === "postgres" && db) {
    try {
      // 1. Guarantee creator user row exists in postgres table to avoid foreign key violations
      if (creatorUser) {
        await db
          .insert(schema.users)
          .values({
            id: creatorUserId,
            auth0Id: creatorUser.auth0Id || `usr_${creatorUserId}`,
            name: creatorUser.name || "Vulture User",
            email: creatorUser.email || null,
            avatarUrl: creatorUser.avatarUrl || null,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: schema.users.auth0Id,
            set: {
              name: creatorUser.name || "Vulture User",
              email: creatorUser.email || null,
              avatarUrl: creatorUser.avatarUrl || null,
              updatedAt: new Date(),
            },
          });
      }

      const inserted = await db
        .insert(schema.groups)
        .values({
          id,
          name: name.trim(),
          inviteCode: code,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      await db.insert(schema.groupMembers).values({
        id: `mem_${id}_${creatorUserId}`,
        groupId: id,
        userId: creatorUserId,
        joinedAt: new Date(),
        lastSeenAt: new Date(),
      });

      const created = inserted[0];
      memoryStore.groups.set(id, created);
      memoryStore.members.set(`${id}_${creatorUserId}`, {
        id: `mem_${id}_${creatorUserId}`,
        groupId: id,
        userId: creatorUserId,
        joinedAt: new Date(),
        lastSeenAt: new Date(),
      });

      return created;
    } catch (err) {
      console.error("[db] postgres createGroup error:", err);
      if (!isDemoMode) {
        throw new Error(err instanceof Error ? err.message : "Failed to persist group to database");
      }
    }
  }

  const newGroup: schema.Group = {
    id,
    name: name.trim(),
    inviteCode: code,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memoryStore.groups.set(id, newGroup);
  memoryStore.members.set(`${id}_${creatorUserId}`, {
    id: `mem_${id}_${creatorUserId}`,
    groupId: id,
    userId: creatorUserId,
    joinedAt: new Date(),
    lastSeenAt: new Date(),
  });
  return newGroup;
}

export async function joinGroup(
  inviteCode: string,
  userId: string,
  userDetails?: { name?: string; email?: string | null; avatarUrl?: string | null; auth0Id?: string }
): Promise<{ success: boolean; group?: schema.Group; error?: string }> {
  const group = await getGroupByInviteCode(inviteCode);
  if (!group) {
    return { success: false, error: "Invalid group invite code." };
  }

  const isMember = await verifyGroupMembership(group.id, userId);
  if (isMember) {
    return { success: true, group };
  }

  const health = await checkDatabaseHealth();
  if (health.type === "postgres" && db) {
    try {
      if (userDetails) {
        await db
          .insert(schema.users)
          .values({
            id: userId,
            auth0Id: userDetails.auth0Id || `usr_${userId}`,
            name: userDetails.name || "Vulture User",
            email: userDetails.email || null,
            avatarUrl: userDetails.avatarUrl || null,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: schema.users.auth0Id,
            set: {
              name: userDetails.name || "Vulture User",
              email: userDetails.email || null,
              avatarUrl: userDetails.avatarUrl || null,
              updatedAt: new Date(),
            },
          });
      }

      await db.insert(schema.groupMembers).values({
        id: `mem_${group.id}_${userId}`,
        groupId: group.id,
        userId,
        joinedAt: new Date(),
        lastSeenAt: new Date(),
      });
      return { success: true, group };
    } catch (err) {
      console.error("[db] postgres joinGroup error:", err);
      if (!isDemoMode) {
        return { success: false, error: err instanceof Error ? err.message : "Failed to join group in database" };
      }
    }
  }

  memoryStore.members.set(`${group.id}_${userId}`, {
    id: `mem_${group.id}_${userId}`,
    groupId: group.id,
    userId,
    joinedAt: new Date(),
    lastSeenAt: new Date(),
  });

  return { success: true, group };
}

export async function updateMemberLastSeen(groupId: string, userId: string): Promise<void> {
  const health = await checkDatabaseHealth();
  const now = new Date();
  if (health.type === "postgres" && db) {
    try {
      await db
        .update(schema.groupMembers)
        .set({ lastSeenAt: now })
        .where(and(eq(schema.groupMembers.groupId, groupId), eq(schema.groupMembers.userId, userId)));
      return;
    } catch {
      // ignore
    }
  }

  const key = `${groupId}_${userId}`;
  const existing = memoryStore.members.get(key);
  if (existing) {
    existing.lastSeenAt = now;
  }
}

export async function getGroupPresence(groupId: string): Promise<{ memberCount: number; onlineCount: number }> {
  const health = await checkDatabaseHealth();
  const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);

  if (health.type === "postgres" && db) {
    try {
      const allMembers = await db
        .select()
        .from(schema.groupMembers)
        .where(eq(schema.groupMembers.groupId, groupId));
      const online = allMembers.filter((m) => m.lastSeenAt && m.lastSeenAt >= fiveMinsAgo).length;
      return {
        memberCount: Math.max(allMembers.length, 1),
        onlineCount: Math.max(online, 1),
      };
    } catch {
      // ignore
    }
  }

  let memberCount = 0;
  let onlineCount = 0;
  for (const m of memoryStore.members.values()) {
    if (m.groupId === groupId) {
      memberCount++;
      if (new Date(m.lastSeenAt).getTime() >= fiveMinsAgo.getTime()) {
        onlineCount++;
      }
    }
  }
  return {
    memberCount: Math.max(memberCount, 1),
    onlineCount: Math.max(onlineCount, 1),
  };
}

export async function getGroupMessages(
  groupId: string,
  options?: { since?: Date; limit?: number }
): Promise<MessageWithSender[]> {
  const limit = options?.limit || 50;
  const since = options?.since;
  const health = await checkDatabaseHealth();

  if (health.type === "postgres" && db) {
    try {
      const query = db
        .select({
          message: schema.messages,
          sender: {
            id: schema.users.id,
            name: schema.users.name,
            avatarUrl: schema.users.avatarUrl,
          },
        })
        .from(schema.messages)
        .innerJoin(schema.users, eq(schema.messages.senderId, schema.users.id))
        .where(
          since
            ? and(eq(schema.messages.groupId, groupId), gt(schema.messages.createdAt, since))
            : eq(schema.messages.groupId, groupId)
        )
        .orderBy(desc(schema.messages.createdAt))
        .limit(limit);

      const rows = await query;
      if (rows.length > 0) {
        return rows.map((r) => ({
          ...r.message,
          sender: r.sender,
        }));
      }
    } catch (err) {
      console.warn("[db] postgres getGroupMessages error:", err);
    }
  }

  // Memory fallback
  const list: MessageWithSender[] = [];
  for (const msg of memoryStore.messages.values()) {
    if (msg.groupId !== groupId) continue;
    if (since && new Date(msg.createdAt).getTime() <= new Date(since).getTime()) continue;

    const senderUser = memoryStore.users.get(msg.senderId) || {
      id: msg.senderId,
      name: "Unknown Member",
      avatarUrl: null,
    };

    list.push({
      ...msg,
      sender: {
        id: senderUser.id,
        name: senderUser.name,
        avatarUrl: senderUser.avatarUrl,
      },
    });
  }

  // Sort newest first
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return list.slice(0, limit);
}

export async function createBroadcastMessage(
  data: schema.NewMessage,
  senderUser?: { id: string; name?: string; email?: string | null; avatarUrl?: string | null; auth0Id?: string }
): Promise<MessageWithSender> {
  const health = await checkDatabaseHealth();

  if (health.type === "postgres" && db) {
    try {
      if (senderUser) {
        await db
          .insert(schema.users)
          .values({
            id: data.senderId,
            auth0Id: senderUser.auth0Id || `usr_${data.senderId}`,
            name: senderUser.name || "Member",
            email: senderUser.email || null,
            avatarUrl: senderUser.avatarUrl || null,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .onConflictDoNothing();
      }

      const inserted = await db.insert(schema.messages).values(data).returning();
      const message = inserted[0];
      const sender = await getUserById(message.senderId);
      
      // Mirror to memory store
      memoryStore.messages.set(message.id, message);

      return {
        ...message,
        sender: {
          id: sender?.id || message.senderId,
          name: sender?.name || "Member",
          avatarUrl: sender?.avatarUrl || null,
        },
      };
    } catch (err) {
      console.error("[db] postgres createBroadcastMessage error:", err);
      if (!isDemoMode) {
        throw new Error(err instanceof Error ? err.message : "Failed to persist broadcast to database");
      }
    }
  }

  const message: schema.Message = {
    id: data.id,
    groupId: data.groupId,
    senderId: data.senderId,
    transcript: data.transcript,
    summary: data.summary,
    priority: data.priority,
    category: data.category,
    urgencyScore: data.urgencyScore ?? 50,
    durationMs: data.durationMs ?? null,
    processingStatus: data.processingStatus ?? "READY",
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    expiresAt: new Date(data.expiresAt),
  };

  memoryStore.messages.set(message.id, message);

  const sender = memoryStore.users.get(message.senderId) || {
    id: message.senderId,
    name: "Member",
    avatarUrl: null,
  };

  return {
    ...message,
    sender: {
      id: sender.id,
      name: sender.name,
      avatarUrl: sender.avatarUrl,
    },
  };
}

/**
 * Automatically joins any authenticated user to default squads
 * so new users never hit an empty dashboard or 'Access Restricted' screens.
 */
export async function ensureDefaultGroupMemberships(userId: string): Promise<void> {
  const defaultCodes = ["HACK-2026", "TRF-900", "PRJX-44"];
  for (const code of defaultCodes) {
    try {
      await joinGroup(code, userId);
    } catch {
      // ignore
    }
  }
}

