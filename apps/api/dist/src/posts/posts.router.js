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
exports.PostsRouter = void 0;
const common_1 = require("@nestjs/common");
const nestjs_trpc_1 = require("nestjs-trpc");
const zod_1 = require("zod");
const auth_trpc_middleware_1 = require("../auth/auth-trpc.middleware");
const posts_service_1 = require("./posts.service");
const schemas_1 = require("@repo/trpc/schemas");
let PostsRouter = class PostsRouter {
    postsService;
    constructor(postsService) {
        this.postsService = postsService;
    }
    findAll(context, input) {
        return this.postsService.findAll(context.user.id, input.userId);
    }
    create(input, context) {
        return this.postsService.create(input, context.user.id);
    }
    likePost(likePostInput, context) {
        return this.postsService.likePost(likePostInput.postId, context.user.id);
    }
    savePost(savePostInput, context) {
        return this.postsService.savePost(savePostInput.postId, context.user.id);
    }
    getSavedPosts(context) {
        return this.postsService.getSavedPosts(context.user.id);
    }
};
exports.PostsRouter = PostsRouter;
__decorate([
    (0, nestjs_trpc_1.Query)({ output: zod_1.z.array(schemas_1.postSchema), input: schemas_1.findAllPostsSchema }),
    __param(0, (0, nestjs_trpc_1.Ctx)()),
    __param(1, (0, nestjs_trpc_1.Input)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PostsRouter.prototype, "findAll", null);
__decorate([
    (0, nestjs_trpc_1.Mutation)({ input: schemas_1.createPostSchema }),
    __param(0, (0, nestjs_trpc_1.Input)()),
    __param(1, (0, nestjs_trpc_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PostsRouter.prototype, "create", null);
__decorate([
    (0, nestjs_trpc_1.Mutation)({ input: schemas_1.likePostSchema }),
    __param(0, (0, nestjs_trpc_1.Input)()),
    __param(1, (0, nestjs_trpc_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PostsRouter.prototype, "likePost", null);
__decorate([
    (0, nestjs_trpc_1.Mutation)({ input: schemas_1.savePostSchema }),
    __param(0, (0, nestjs_trpc_1.Input)()),
    __param(1, (0, nestjs_trpc_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PostsRouter.prototype, "savePost", null);
__decorate([
    (0, nestjs_trpc_1.Query)({ output: zod_1.z.array(schemas_1.postSchema) }),
    __param(0, (0, nestjs_trpc_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PostsRouter.prototype, "getSavedPosts", null);
exports.PostsRouter = PostsRouter = __decorate([
    (0, nestjs_trpc_1.Router)({ alias: 'posts' }),
    (0, nestjs_trpc_1.UseMiddlewares)(auth_trpc_middleware_1.AuthTrpcMiddleware),
    __param(0, (0, common_1.Inject)(posts_service_1.PostsService)),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsRouter);
//# sourceMappingURL=posts.router.js.map