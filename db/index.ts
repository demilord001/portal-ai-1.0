import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema';

// Avoid throwing unhandled exceptions at module initialization
const databaseUrl = process.env.DATABASE_URL || '';
export const isDbConfigured = 
  !!databaseUrl && 
  !databaseUrl.includes('placeholder') && 
  !databaseUrl.includes('your_password');

let sqlClient: ReturnType<typeof neon> | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

if (isDbConfigured) {
  try {
    sqlClient = neon(databaseUrl);
    dbInstance = drizzle({ client: sqlClient, schema });
  } catch (err) {
    console.warn('Portal.AI: Neon DB connection skipped, using local fallback.', err);
  }
}

export const db = dbInstance;
export * from '@/db/schema';
