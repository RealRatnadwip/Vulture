import { z } from "zod";

export const priorityEnum = z.enum(["LOW", "NORMAL", "HIGH", "CRITICAL"]);
export type PriorityLevel = z.infer<typeof priorityEnum>;

export const categoryEnum = z.enum([
  "STATUS",
  "SCHEDULE",
  "TASK",
  "INCIDENT",
  "DECISION",
  "INFORMATION",
  "SOCIAL",
  "OTHER",
]);
export type MessageCategory = z.infer<typeof categoryEnum>;

// Gemini strict JSON schema validation
export const geminiClassificationSchema = z.object({
  summary: z.string().min(1).max(250),
  priority: priorityEnum,
  category: categoryEnum,
  urgencyScore: z.number().int().min(0).max(100),
  expiresInMinutes: z.number().int().min(5).max(1440),
});
export type GeminiClassification = z.infer<typeof geminiClassificationSchema>;

// API request schema for direct text broadcast (demo or fallback)
export const createTextMessageSchema = z.object({
  groupId: z.string().min(1),
  transcript: z.string().min(1).max(2000),
  durationMs: z.number().int().optional(),
});

// API request schema for group creation
export const createGroupSchema = z.object({
  name: z.string().min(2).max(50),
});

// API request schema for joining group with invite code
export const joinGroupSchema = z.object({
  inviteCode: z.string().min(2).max(20),
});
