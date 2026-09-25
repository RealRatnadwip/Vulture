import "./load-env";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../../drizzle/schema";
import { DEMO_USERS } from "../auth/demo-users";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/vulture";

async function main() {
  console.log("🦅 [Vulture] Seeding database at:", connectionString.replace(/:[^:@]*@/, ":***@"));

  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql, { schema });

  try {
    // 1. Seed demo users
    console.log("-> Seeding demo users...");
    for (const u of DEMO_USERS) {
      await db
        .insert(schema.users)
        .values({
          id: u.id,
          auth0Id: u.auth0Id,
          name: u.name,
          email: u.email,
          avatarUrl: u.avatarUrl,
        })
        .onConflictDoUpdate({
          target: schema.users.auth0Id,
          set: { name: u.name, email: u.email, avatarUrl: u.avatarUrl },
        });
    }

    // 2. Seed groups
    console.log("-> Seeding demo groups...");
    const demoGroup = {
      id: "grp_hackathon",
      name: "HACKATHON",
      inviteCode: "HACK-2026",
    };

    const trafficGroup = {
      id: "grp_traffic",
      name: "TRAFFIC",
      inviteCode: "TRF-900",
    };

    const projectXGroup = {
      id: "grp_projectx",
      name: "PROJECT X",
      inviteCode: "PRJX-44",
    };

    for (const g of [demoGroup, trafficGroup, projectXGroup]) {
      await db
        .insert(schema.groups)
        .values(g)
        .onConflictDoUpdate({
          target: schema.groups.id,
          set: { name: g.name, inviteCode: g.inviteCode },
        });
    }

    // 3. Seed memberships
    console.log("-> Seeding group memberships...");
    for (const u of DEMO_USERS) {
      await db
        .insert(schema.groupMembers)
        .values({
          id: `mem_${demoGroup.id}_${u.id}`,
          groupId: demoGroup.id,
          userId: u.id,
          lastSeenAt: new Date(),
        })
        .onConflictDoNothing();

      if (u.id === "usr_ratnadwip" || u.id === "usr_himanshu") {
        await db
          .insert(schema.groupMembers)
          .values({
            id: `mem_${projectXGroup.id}_${u.id}`,
            groupId: projectXGroup.id,
            userId: u.id,
            lastSeenAt: new Date(),
          })
          .onConflictDoNothing();
      }
    }

    // 4. Seed realistic messages
    console.log("-> Seeding initial broadcast messages...");
    const now = Date.now();
    const seedMsgs = [
      {
        id: "msg_seed_1",
        groupId: demoGroup.id,
        senderId: "usr_ratnadwip",
        transcript: "Guys, the backend server is down. Don't deploy anything until it's back.",
        summary: "Backend server is down. Freeze deployments.",
        priority: "CRITICAL",
        category: "INCIDENT",
        urgencyScore: 98,
        durationMs: 4200,
        processingStatus: "READY",
        createdAt: new Date(now - 1000 * 60 * 3),
        expiresAt: new Date(now + 1000 * 60 * 27),
      },
      {
        id: "msg_seed_2",
        groupId: demoGroup.id,
        senderId: "usr_himanshu",
        transcript: "I've pushed the latest frontend build. Let me know if you hit any UI bugs.",
        summary: "Pushed latest frontend build.",
        priority: "NORMAL",
        category: "STATUS",
        urgencyScore: 45,
        durationMs: 3800,
        processingStatus: "READY",
        createdAt: new Date(now - 1000 * 60 * 12),
        expiresAt: new Date(now + 1000 * 60 * 168),
      },
      {
        id: "msg_seed_3",
        groupId: demoGroup.id,
        senderId: "usr_koushik",
        transcript: "The project presentation has been scheduled for 5 PM sharp.",
        summary: "Presentation is at 5 PM.",
        priority: "HIGH",
        category: "SCHEDULE",
        urgencyScore: 82,
        durationMs: 3100,
        processingStatus: "READY",
        createdAt: new Date(now - 1000 * 60 * 25),
        expiresAt: new Date(now + 1000 * 60 * 95),
      },
      {
        id: "msg_seed_4",
        groupId: demoGroup.id,
        senderId: "usr_ranit",
        transcript: "Can someone check the database connection? The pool seems saturated.",
        summary: "Check database connection pool.",
        priority: "HIGH",
        category: "TASK",
        urgencyScore: 79,
        durationMs: 3600,
        processingStatus: "READY",
        createdAt: new Date(now - 1000 * 60 * 40),
        expiresAt: new Date(now + 1000 * 60 * 80),
      },
      {
        id: "msg_seed_5",
        groupId: demoGroup.id,
        senderId: "usr_koushik",
        transcript: "I'll join the sync in about ten minutes, stepping away briefly.",
        summary: "Joining in 10 minutes.",
        priority: "LOW",
        category: "STATUS",
        urgencyScore: 20,
        durationMs: 2500,
        processingStatus: "READY",
        createdAt: new Date(now - 1000 * 60 * 55),
        expiresAt: new Date(now - 1000 * 60 * 10), // expired
      },
    ];

    for (const msg of seedMsgs) {
      await db
        .insert(schema.messages)
        .values(msg)
        .onConflictDoNothing();
    }

    console.log("✅ [Vulture] Database seeded successfully!");
  } catch (error) {
    console.error("❌ [Vulture] Error seeding database:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
