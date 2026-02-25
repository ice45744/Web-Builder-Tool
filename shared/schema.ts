import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  studentId: text("student_id").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("student"),
  goodDeedPoints: integer("good_deed_points").notNull().default(0),
  garbageStamps: integer("garbage_stamps").notNull().default(0),
});

export const goodDeeds = pgTable("good_deeds", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // 'morning_check', 'custom'
  imageUrl: text("image_url"),
  details: text("details"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const garbageTransactions = pgTable("garbage_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  stampsAdded: integer("stamps_added").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const issues = pgTable("issues", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  category: text("category").notNull(),
  details: text("details").notNull(),
  imageUrl: text("image_url"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorRole: text("author_role").notNull().default("committee"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, role: true, goodDeedPoints: true, garbageStamps: true });
export const insertGoodDeedSchema = createInsertSchema(goodDeeds).omit({ id: true, userId: true, status: true, createdAt: true });
export const insertIssueSchema = createInsertSchema(issues).omit({ id: true, userId: true, status: true, createdAt: true });
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type GoodDeed = typeof goodDeeds.$inferSelect;
export type InsertGoodDeed = z.infer<typeof insertGoodDeedSchema>;
export type GarbageTransaction = typeof garbageTransactions.$inferSelect;
export type Issue = typeof issues.$inferSelect;
export type InsertIssue = z.infer<typeof insertIssueSchema>;
export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
