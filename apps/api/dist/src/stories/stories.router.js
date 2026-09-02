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
exports.StoriesRouter = void 0;
const common_1 = require("@nestjs/common");
const nestjs_trpc_1 = require("nestjs-trpc");
const zod_1 = require("zod");
const auth_trpc_middleware_1 = require("../auth/auth-trpc.middleware");
const stories_service_1 = require("./stories.service");
const schemas_1 = require("@repo/trpc/schemas");
let StoriesRouter = class StoriesRouter {
    storiesService;
    constructor(storiesService) {
        this.storiesService = storiesService;
    }
    create(createStoryInput, context) {
        return this.storiesService.create(createStoryInput, context.user.id);
    }
    getStories(context) {
        return this.storiesService.getStories(context.user.id);
    }
};
exports.StoriesRouter = StoriesRouter;
__decorate([
    (0, nestjs_trpc_1.Mutation)({ input: schemas_1.createStorySchema }),
    __param(0, (0, nestjs_trpc_1.Input)()),
    __param(1, (0, nestjs_trpc_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], StoriesRouter.prototype, "create", null);
__decorate([
    (0, nestjs_trpc_1.Query)({ output: zod_1.z.array(schemas_1.storyGroupSchema) }),
    __param(0, (0, nestjs_trpc_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StoriesRouter.prototype, "getStories", null);
exports.StoriesRouter = StoriesRouter = __decorate([
    (0, nestjs_trpc_1.Router)({ alias: 'stories' }),
    (0, nestjs_trpc_1.UseMiddlewares)(auth_trpc_middleware_1.AuthTrpcMiddleware),
    __param(0, (0, common_1.Inject)(stories_service_1.StoriesService)),
    __metadata("design:paramtypes", [stories_service_1.StoriesService])
], StoriesRouter);
//# sourceMappingURL=stories.router.js.map