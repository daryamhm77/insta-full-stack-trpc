import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
type AuthDatabase = NodePgDatabase<typeof schema>;
export declare function createAuth(database: AuthDatabase, options: {
    baseURL: string;
    secret: string;
    trustedOrigins?: string[];
}): import("better-auth", { with: { "resolution-mode": "import" } }).Auth<{
    baseURL: string;
    secret: string;
    database: (options: import("better-auth", { with: { "resolution-mode": "import" } }).BetterAuthOptions) => import("better-auth", { with: { "resolution-mode": "import" } }).DBAdapter<import("better-auth", { with: { "resolution-mode": "import" } }).BetterAuthOptions>;
    emailAndPassword: {
        enabled: true;
    };
    trustedOrigins: string[] | undefined;
}>;
export type Auth = ReturnType<typeof createAuth>;
export type Session = Auth['$Infer']['Session'];
export {};
