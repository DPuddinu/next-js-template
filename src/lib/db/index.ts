import { Client, createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { env } from '../env.mjs';

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
export const globalForDb = globalThis as unknown as {
  conn: Client;
};

export const conn =
  globalForDb.conn ??
  createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN
  });
if (env.NODE_ENV !== 'production') globalForDb.conn = conn;

export const db = drizzle(conn);
