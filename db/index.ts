import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

export function getDb() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return null;
  }
  try {
    const sql = neon(dbUrl);
    return drizzle(sql, { schema });
  } catch (error) {
    console.warn('Failed to initialize Neon Postgres connection, falling back to local store:', error);
    return null;
  }
}
