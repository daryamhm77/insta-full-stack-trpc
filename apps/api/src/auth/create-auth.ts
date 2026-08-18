import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';

type AuthDatabase = NodePgDatabase<typeof schema>;

export function createAuth(
  database: AuthDatabase,
  options: {
    baseURL: string;
    secret: string;
    trustedOrigins?: string[];
  },
) {
  return betterAuth({
    baseURL: options.baseURL,
    secret: options.secret,
    database: drizzleAdapter(database, {
      provider: 'pg',
      schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    trustedOrigins: options.trustedOrigins,
  });
}

export type Auth = ReturnType<typeof createAuth>;
export type Session = Auth['$Infer']['Session'];
