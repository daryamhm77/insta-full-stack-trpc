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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRouter = void 0;
const common_1 = require("@nestjs/common");
const nestjs_trpc_1 = require("nestjs-trpc");
const zod_1 = require("zod");
const auth_trpc_middleware_1 = require("../auth-trpc.middleware");
const users_service_1 = require("./users.service");
const schemas_1 = require("@repo/trpc/schemas");
let UsersRouter = class UsersRouter {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    follow(input, context) {
        return this.usersService.follow(context.user.id, input.userId);
    }
    unfollow(input, context) {
        return this.usersService.unfollow(context.user.id, input.userId);
    }
    getFollowers(input, context) {
        return this.usersService.getFollowers(input.userId, context.user.id);
    }
    getFollowing(input, context) {
        return this.usersService.getFollowing(input.userId, context.user.id);
    }
    getSuggestedUsers(context) {
        return this.usersService.getSuggestedUsers(context.user.id);
    }
    updateProfile(input, context) {
        return this.usersService.updateProfile(context.user.id, input);
    }
    getUserProfile(input, context) {
        return this.usersService.getUserProfile(input.userId, context.user.id);
    }
};
exports.UsersRouter = UsersRouter;
__decorate([
    (0, nestjs_trpc_1.Mutation)({ input: schemas_1.userIdSchema }),
    __param(0, (0, nestjs_trpc_1.Input)()),
    __param(1, (0, nestjs_trpc_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersRouter.prototype, "follow", null);
__decorate([
    (0, nestjs_trpc_1.Mutation)({ input: schemas_1.userIdSchema }),
    __param(0, (0, nestjs_trpc_1.Input)()),
    __param(1, (0, nestjs_trpc_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersRouter.prototype, "unfollow", null);
__decorate([
    (0, nestjs_trpc_1.Query)({ input: schemas_1.userIdSchema, output: zod_1.z.array(schemas_1.userProfileSchema) }),
    __param(0, (0, nestjs_trpc_1.Input)()),
    __param(1, (0, nestjs_trpc_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersRouter.prototype, "getFollowers", null);
__decorate([
    (0, nestjs_trpc_1.Query)({ input: schemas_1.userIdSchema, output: zod_1.z.array(schemas_1.userProfileSchema) }),
    __param(0, (0, nestjs_trpc_1.Input)()),
    __param(1, (0, nestjs_trpc_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersRouter.prototype, "getFollowing", null);
__decorate([
    (0, nestjs_trpc_1.Query)({ output: zod_1.z.array(schemas_1.userProfileSchema) }),
    __param(0, (0, nestjs_trpc_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersRouter.prototype, "getSuggestedUsers", null);
__decorate([
    (0, nestjs_trpc_1.Mutation)({ input: schemas_1.updateProfileSchema }),
    __param(0, (0, nestjs_trpc_1.Input)()),
    __param(1, (0, nestjs_trpc_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersRouter.prototype, "updateProfile", null);
__decorate([
    (0, nestjs_trpc_1.Query)({ input: schemas_1.userIdSchema, output: schemas_1.userProfileSchema }),
    __param(0, (0, nestjs_trpc_1.Input)()),
    __param(1, (0, nestjs_trpc_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersRouter.prototype, "getUserProfile", null);
exports.UsersRouter = UsersRouter = __decorate([
    (0, nestjs_trpc_1.Router)({ alias: 'users' }),
    (0, nestjs_trpc_1.UseMiddlewares)(auth_trpc_middleware_1.AuthTrpcMiddleware),
    __param(0, (0, common_1.Inject)(users_service_1.UsersService)),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersRouter);
//# sourceMappingURL=users.router.js.map