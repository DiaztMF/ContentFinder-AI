import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

let tablesEnsured = false;

export function getDb() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return null;
  }
  try {
    const sql = neon(dbUrl);

    if (!tablesEnsured) {
      tablesEnsured = true;
      // Asynchronously ensure database tables exist
      sql`
        CREATE TABLE IF NOT EXISTS contents (
          id text PRIMARY KEY,
          title text NOT NULL,
          url text NOT NULL,
          source text,
          author text,
          summary text NOT NULL,
          key_takeaways jsonb NOT NULL,
          category text NOT NULL,
          content_type text NOT NULL,
          read_time text DEFAULT '5 min read',
          difficulty text DEFAULT 'Intermediate',
          relevance_score integer DEFAULT 90,
          views integer DEFAULT 0,
          image_url text,
          raw_content text,
          created_at timestamp DEFAULT now() NOT NULL
        );
        CREATE TABLE IF NOT EXISTS collections (
          id text PRIMARY KEY,
          name text NOT NULL,
          description text,
          color text DEFAULT 'blue',
          icon text DEFAULT 'folder',
          created_at timestamp DEFAULT now() NOT NULL
        );
        CREATE TABLE IF NOT EXISTS saved_items (
          id text PRIMARY KEY,
          collection_id text NOT NULL,
          content_id text NOT NULL,
          notes text,
          saved_at timestamp DEFAULT now() NOT NULL
        );
      `.catch((err) => {
        // Table creation attempt finished or suppressed
      });
    }

    return drizzle(sql, { schema });
  } catch (error) {
    return null;
  }
}

