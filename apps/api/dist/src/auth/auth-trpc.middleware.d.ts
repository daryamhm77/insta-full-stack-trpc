import { AuthService } from '@thallesp/nestjs-better-auth';
import { MiddlewareOptions, MiddlewareResponse, TRPCMiddleware } from 'nestjs-trpc';
export declare class AuthTrpcMiddleware implements TRPCMiddleware {
    private readonly authService;
    constructor(authService: AuthService);
    use(opts: MiddlewareOptions<{
        req: any;
        res: any;
    }>): Promise<MiddlewareResponse>;
}
