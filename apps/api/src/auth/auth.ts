/**
 * Better Auth CLI config.
 * Used by: npx @better-auth/cli generate --config src/auth/auth.ts
 * NestJS uses createAuth() via AuthModule.forRootAsync instead.
 */
import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Minimal db for CLI schema generation (no Nest DI needed)
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ??
    'postgresql://postgres:postgres@localhost:5432/insta',
});
const db = drizzle(pool);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3001',
  secret:
    process.env.BETTER_AUTH_SECRET ??
    'dev-only-secret-replace-me-min-32-chars!!',
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
});
