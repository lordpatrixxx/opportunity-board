import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Only if running with SQLite file: in Vercel serverless environment, copy bundled dev.db
if (process.env.DATABASE_URL?.startsWith('file:') && process.env.VERCEL) {
  try {
    const tmpDbPath = path.join('/tmp', 'dev.db');
    if (!fs.existsSync(tmpDbPath)) {
      const bundledDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
      if (fs.existsSync(bundledDbPath)) {
        fs.copyFileSync(bundledDbPath, tmpDbPath);
      }
    }
    process.env.DATABASE_URL = `file:${tmpDbPath}`;
  } catch (err) {
    console.error('Failed to initialize SQLite in /tmp for Vercel:', err);
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
