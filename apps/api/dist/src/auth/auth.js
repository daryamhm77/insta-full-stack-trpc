"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
require("dotenv/config");
const better_auth_1 = require("better-auth");
const drizzle_1 = require("better-auth/adapters/drizzle");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL ??
        'postgresql://postgres:postgres@localhost:5432/insta',
});
const db = (0, node_postgres_1.drizzle)(pool);
exports.auth = (0, better_auth_1.betterAuth)({
    baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3001',
    secret: process.env.BETTER_AUTH_SECRET ??
        'dev-only-secret-replace-me-min-32-chars!!',
    database: (0, drizzle_1.drizzleAdapter)(db, {
        provider: 'pg',
    }),
    emailAndPassword: {
        enabled: true,
    },
});
//# sourceMappingURL=auth.js.map