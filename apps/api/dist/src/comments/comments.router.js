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
exports.CommentsRouter = void 0;
const common_1 = require("@nestjs/common");
const nestjs_trpc_1 = require("nestjs-trpc");
const zod_1 = require("zod");
const auth_trpc_middleware_1 = require("../auth/auth-trpc.middleware");
const comments_service_1 = require("./comments.service");
const schemas_1 = require("@repo/trpc/schemas");
let CommentsRouter = class CommentsRouter {
    commentsService;
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    create(createCommentInput, context) {
        return this.commentsService.create(createCommentInput, context.user.id);
    }
    findByPostId(getCommentsInput) {
        return this.commentsService.findByPostId(getCommentsInput.postId);
    }
    delete(deleteCommentInput, context) {
        return this.commentsService.delete(deleteCommentInput.commentId, context.user.id);
    }
};
exports.CommentsRouter = CommentsRouter;
__decorate([
    (0, nestjs_trpc_1.Mutation)({ input: schemas_1.createCommentSchema }),
    __param(0, (0, nestjs_trpc_1.Input)()),
    __param(1, (0, nestjs_trpc_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CommentsRouter.prototype, "create", null);
__decorate([
    (0, nestjs_trpc_1.Query)({ input: schemas_1.getCommentsSchema, output: zod_1.z.array(schemas_1.commentSchema) }),
    __param(0, (0, nestjs_trpc_1.Input)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CommentsRouter.prototype, "findByPostId", null);
__decorate([
    (0, nestjs_trpc_1.Mutation)({ input: schemas_1.deleteCommentSchema }),
    __param(0, (0, nestjs_trpc_1.Input)()),
    __param(1, (0, nestjs_trpc_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CommentsRouter.prototype, "delete", null);
exports.CommentsRouter = CommentsRouter = __decorate([
    (0, nestjs_trpc_1.Router)({ alias: 'comments' }),
    (0, nestjs_trpc_1.UseMiddlewares)(auth_trpc_middleware_1.AuthTrpcMiddleware),
    __param(0, (0, common_1.Inject)(comments_service_1.CommentsService)),
    __metadata("design:paramtypes", [comments_service_1.CommentsService])
], CommentsRouter);
//# sourceMappingURL=comments.router.js.map