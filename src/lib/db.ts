import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
  var dbCheckPromise: Promise<boolean> | undefined;
  var dbConnected: boolean | undefined;
  var dbLastCheck: number | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

export async function checkDbConnection(): Promise<boolean> {
  const now = Date.now();

  // If we recently confirmed a good connection, trust it for 30 seconds
  if (globalThis.dbConnected === true && globalThis.dbLastCheck && now - globalThis.dbLastCheck < 30000) {
    return true;
  }

  // If we recently confirmed a failed connection, wait 5 minutes before retrying
  if (globalThis.dbConnected === false && globalThis.dbLastCheck && now - globalThis.dbLastCheck < 300000) {
    return false;
  }

  if (globalThis.dbCheckPromise) {
    return globalThis.dbCheckPromise;
  }

  globalThis.dbLastCheck = now;

  globalThis.dbCheckPromise = new Promise<boolean>(async (resolve) => {
    try {
      // Race select 1 query against a 3000ms timeout (allows for Supabase cold starts)
      const timeout = new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 3000)
      );
      await Promise.race([db.$queryRawUnsafe("SELECT 1"), timeout]);
      globalThis.dbConnected = true;
      resolve(true);
    } catch (e) {
      console.warn("Database connectivity check failed. Operating in database-free fallback mode.");
      globalThis.dbConnected = false;
      resolve(false);
    } finally {
      globalThis.dbCheckPromise = undefined;
    }
  });

  return globalThis.dbCheckPromise;
}
