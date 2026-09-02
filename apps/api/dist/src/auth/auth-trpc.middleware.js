"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTrpcMiddleware = void 0;
const nestjs_better_auth_1 = require("@thallesp/nestjs-better-auth");
const common_1 = require("@nestjs/common");
let AuthTrpcMiddleware = class AuthTrpcMiddleware {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async use(opts) {
        const { ctx, next } = opts;
        try {
            const session = await this.authService.api.getSession({
                headers: ctx.req.headers,
            });
            if (session?.user && session.session) {
                return next({
                    ctx: {
                        ...ctx,
                        user: session.user,
                        session: session.session,
                    },
                });
            }
            throw new Error('Unauthorized');
        }
        catch {
            throw new Error('Unauthorized');
        }
    }
};
exports.AuthTrpcMiddleware = AuthTrpcMiddleware;
exports.AuthTrpcMiddleware = AuthTrpcMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_better_auth_1.AuthService])
], AuthTrpcMiddleware);
//# sourceMappingURL=auth-trpc.middleware.js.map