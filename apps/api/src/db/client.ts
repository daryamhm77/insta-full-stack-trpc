/**
 * Standalone db client for CLI tools (drizzle-kit, better-auth generate).
 * The Nest app uses DatabaseModule + DATABASE_CONNECTION instead.
 */
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
