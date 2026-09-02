import { ContextOptions, TRPCContext } from 'nestjs-trpc';
export declare class AppContext implements TRPCContext {
    create(opts: ContextOptions): Record<string, unknown> | Promise<Record<string, unknown>>;
}
