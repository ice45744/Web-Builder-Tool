import { z } from 'zod';
import { insertGoodDeedSchema, insertIssueSchema, insertUserSchema, insertAnnouncementSchema, users, goodDeeds, issues, garbageTransactions, announcements } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/login' as const,
      input: z.object({ studentId: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: z.object({ message: z.string() })
      }
    },
    register: {
      method: 'POST' as const,
      path: '/api/register' as const,
      input: insertUserSchema.extend({
        committeeCode: z.string().optional()
      }),
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation
      }
    },
    me: {
      method: 'GET' as const,
      path: '/api/me' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: z.object({ message: z.string() })
      }
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout' as const,
      responses: {
        200: z.object({ message: z.string() })
      }
    }
  },
  goodDeeds: {
    list: {
      method: 'GET' as const,
      path: '/api/good-deeds' as const,
      responses: {
        200: z.array(z.custom<typeof goodDeeds.$inferSelect>())
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/good-deeds' as const,
      input: insertGoodDeedSchema,
      responses: {
        201: z.custom<typeof goodDeeds.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  },
  garbage: {
    list: {
      method: 'GET' as const,
      path: '/api/garbage-transactions' as const,
      responses: {
        200: z.array(z.custom<typeof garbageTransactions.$inferSelect>())
      }
    }
  },
  issues: {
    create: {
      method: 'POST' as const,
      path: '/api/issues' as const,
      input: insertIssueSchema,
      responses: {
        201: z.custom<typeof issues.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  },
  announcements: {
    list: {
      method: 'GET' as const,
      path: '/api/announcements' as const,
      responses: {
        200: z.array(z.custom<typeof announcements.$inferSelect>())
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/announcements' as const,
      input: insertAnnouncementSchema,
      responses: {
        201: z.custom<typeof announcements.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
