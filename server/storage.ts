import { db } from "./db";
import { users, goodDeeds, garbageTransactions, issues, announcements, type User, type InsertUser, type GoodDeed, type InsertGoodDeed, type GarbageTransaction, type Issue, type InsertIssue, type Announcement, type InsertAnnouncement } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByStudentId(studentId: string): Promise<User | undefined>;
  createUser(user: InsertUser & { role?: string }): Promise<User>;
  
  getGoodDeeds(userId: number): Promise<GoodDeed[]>;
  createGoodDeed(userId: number, deed: InsertGoodDeed): Promise<GoodDeed>;
  
  getGarbageTransactions(userId: number): Promise<GarbageTransaction[]>;
  addGarbageStamps(userId: number, stamps: number, description: string): Promise<GarbageTransaction>;
  
  createIssue(userId: number, issue: InsertIssue): Promise<Issue>;

  addGoodDeedPoints(userId: number, points: number): Promise<User>;

  getAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByStudentId(studentId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.studentId, studentId));
    return user;
  }

  async createUser(insertUser: InsertUser & { role?: string }): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getGoodDeeds(userId: number): Promise<GoodDeed[]> {
    return await db.select().from(goodDeeds).where(eq(goodDeeds.userId, userId));
  }

  async createGoodDeed(userId: number, deed: InsertGoodDeed): Promise<GoodDeed> {
    const [created] = await db.insert(goodDeeds).values({ ...deed, userId }).returning();
    return created;
  }

  async getGarbageTransactions(userId: number): Promise<GarbageTransaction[]> {
    return await db.select().from(garbageTransactions).where(eq(garbageTransactions.userId, userId));
  }

  async addGarbageStamps(userId: number, stamps: number, description: string): Promise<GarbageTransaction> {
    const user = await this.getUser(userId);
    if (user) {
      await db.update(users)
        .set({ garbageStamps: user.garbageStamps + stamps })
        .where(eq(users.id, userId));
    }
    
    const [transaction] = await db.insert(garbageTransactions)
      .values({ userId, stampsAdded: stamps, description })
      .returning();
    return transaction;
  }

  async createIssue(userId: number, issue: InsertIssue): Promise<Issue> {
    const [created] = await db.insert(issues).values({ ...issue, userId }).returning();
    return created;
  }

  async addGoodDeedPoints(userId: number, points: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    const [updated] = await db.update(users)
      .set({ goodDeedPoints: user.goodDeedPoints + points })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements).orderBy(desc(announcements.createdAt));
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [created] = await db.insert(announcements).values(announcement).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
