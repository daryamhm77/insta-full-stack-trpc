import 'dotenv/config';
export declare const auth: import("better-auth", { with: { "resolution-mode": "import" } }).Auth<{
    baseURL: string;
    secret: string;
    database: (options: import("better-auth", { with: { "resolution-mode": "import" } }).BetterAuthOptions) => import("better-auth", { with: { "resolution-mode": "import" } }).DBAdapter<import("better-auth", { with: { "resolution-mode": "import" } }).BetterAuthOptions>;
    emailAndPassword: {
        enabled: true;
    };
}>;
