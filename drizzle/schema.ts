import { pgTable, text, timestamp, integer, uniqueIndex, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  auth0Id: text("auth0_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const groups = pgTable("groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  inviteCode: text("invite_code").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const groupMembers = pgTable(
  "group_members",
  {
    id: text("id").primaryKey(),
    groupId: text("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("group_members_group_user_idx").on(table.groupId, table.userId),
    index("group_members_group_id_idx").on(table.groupId),
    index("group_members_user_id_idx").on(table.userId),
  ]
);

export const messages = pgTable(
  "messages",
  {
    id: text("id").primaryKey(),
    groupId: text("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
    senderId: text("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    transcript: text("transcript").notNull(),
    summary: text("summary").notNull(),
    priority: text("priority").notNull(), // 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL'
    category: text("category").notNull(), // 'STATUS' | 'SCHEDULE' | 'TASK' | 'INCIDENT' | 'DECISION' | 'INFORMATION' | 'SOCIAL' | 'OTHER'
    urgencyScore: integer("urgency_score").notNull().default(50),
    durationMs: integer("duration_ms"),
    processingStatus: text("processing_status").notNull().default("READY"), // 'PROCESSING' | 'READY' | 'FAILED'
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("messages_group_id_idx").on(table.groupId),
    index("messages_created_at_idx").on(table.createdAt),
    index("messages_priority_idx").on(table.priority),
    index("messages_expires_at_idx").on(table.expiresAt),
  ]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;
export type GroupMember = typeof groupMembers.$inferSelect;
export type NewGroupMember = typeof groupMembers.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
