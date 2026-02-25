import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

const BCRYPT_ROUNDS = 12;

function sanitizeUser(user: any) {
  const { password, ...safe } = user;
  return safe;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be set. Did you forget to configure this secret?");
  }

  // Setup Session
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    store: storage.sessionStore,
  }));

  // Setup Passport
  passport.use(new LocalStrategy({ usernameField: "studentId" }, async (studentId, password, done) => {
    try {
      const user = await storage.getUserByStudentId(studentId);
      if (!user) {
        return done(null, false, { message: "Invalid credentials" });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return done(null, false, { message: "Invalid credentials" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());

  const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized" });
  };

  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existingUser = await storage.getUserByStudentId(input.studentId);
      if (existingUser) {
        return res.status(400).json({ message: "Student ID already registered" });
      }
      const role = input.committeeCode === "STCOUNCIL2026" ? "committee" : "student";
      const hashedPassword = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
      const user = await storage.createUser({ ...input, password: hashedPassword, role });
      req.login(user, (err) => {
        if (err) throw err;
        res.status(201).json(sanitizeUser(user));
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.login.path, passport.authenticate("local"), (req, res) => {
    res.status(200).json(sanitizeUser(req.user));
  });

  app.post(api.auth.logout.path, (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    res.status(200).json(sanitizeUser(req.user));
  });

  app.get(api.goodDeeds.list.path, requireAuth, async (req: any, res) => {
    const deeds = await storage.getGoodDeeds(req.user.id);
    res.status(200).json(deeds);
  });

  app.post(api.goodDeeds.create.path, requireAuth, async (req: any, res) => {
    try {
      const input = api.goodDeeds.create.input.parse(req.body);
      const deed = await storage.createGoodDeed(req.user.id, input);
      res.status(201).json(deed);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.goodDeeds.claimQr.path, requireAuth, async (req: any, res) => {
    const { code } = req.body;
    // For now, any QR code starting with 'GOOD_DEED_' is valid and gives 1 point
    if (typeof code === 'string' && code.startsWith('GOOD_DEED_')) {
      try {
        await storage.addGoodDeedPoints(req.user.id, 1);
        // Also record it as a good deed entry
        await storage.createGoodDeed(req.user.id, {
          type: 'qr_claim',
          details: `สแกนรับแต้มจากรหัส: ${code}`,
          imageUrl: null
        });
        return res.status(200).json({ message: "ได้รับ 1 แต้มความดีเรียบร้อยแล้ว!", points: 1 });
      } catch (err) {
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึกแต้ม" });
      }
    }
    res.status(400).json({ message: "คิวอาร์โค้ดไม่ถูกต้อง" });
  });

  app.get(api.garbage.list.path, requireAuth, async (req: any, res) => {
    const tx = await storage.getGarbageTransactions(req.user.id);
    res.status(200).json(tx);
  });

  app.post(api.issues.create.path, requireAuth, async (req: any, res) => {
    try {
      const input = api.issues.create.input.parse(req.body);
      const issue = await storage.createIssue(req.user.id, input);
      res.status(201).json(issue);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.announcements.list.path, async (req, res) => {
    const list = await storage.getAnnouncements();
    res.status(200).json(list);
  });

  app.post(api.announcements.create.path, requireAuth, async (req: any, res) => {
    if (req.user.role !== "committee") {
      return res.status(403).json({ message: "Only committee can post announcements" });
    }
    try {
      const input = api.announcements.create.input.parse(req.body);
      const announcement = await storage.createAnnouncement(input);
      res.status(201).json(announcement);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
