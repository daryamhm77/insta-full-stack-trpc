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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const schema_1 = require("../auth/schema");
const users_service_1 = require("../auth/users/users.service");
const database_connection_1 = require("../db/database-connection");
const schema_2 = require("../db/schema");
let PostsService = class PostsService {
    database;
    usersService;
    constructor(database, usersService) {
        this.database = database;
        this.usersService = usersService;
    }
    async create(createPostInput, userId) {
        await this.database.insert(schema_2.post).values({
            userId,
            caption: createPostInput.caption,
            image: createPostInput.image,
            createdAt: new Date(),
        });
    }
    async findAll(userId, postUserId) {
        const posts = await this.database.query.post.findMany({
            with: {
                user: true,
                likes: true,
                comments: true,
            },
            where: postUserId
                ? (0, drizzle_orm_1.eq)(schema_2.post.userId, postUserId)
                : (0, drizzle_orm_1.inArray)(schema_2.post.userId, await this.getFollowedUserIds(userId)),
            orderBy: [(0, drizzle_orm_1.desc)(schema_2.post.createdAt)],
        });
        const saved = await this.getSavedPosts(userId);
        const savedIds = new Set(saved.map((item) => item.id));
        return posts.map((item) => ({
            id: item.id,
            user: {
                username: item.user.name,
                id: item.user.id,
                avatar: item.user.image || '',
            },
            image: item.image,
            caption: item.caption,
            likes: item.likes.length,
            comments: item.comments.length,
            timestamp: item.createdAt.toISOString(),
            isLiked: item.likes.some((likeItem) => likeItem.userId === userId),
            isSaved: savedIds.has(item.id),
        }));
    }
    async getFollowedUserIds(userId) {
        const following = await this.database
            .select({ id: schema_1.follow.followingId })
            .from(schema_1.follow)
            .where((0, drizzle_orm_1.eq)(schema_1.follow.followerId, userId));
        return [userId, ...following.map((f) => f.id)];
    }
    async likePost(postId, userId) {
        const existingLike = await this.database.query.like.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_2.like.postId, postId), (0, drizzle_orm_1.eq)(schema_2.like.userId, userId)),
        });
        if (existingLike) {
            await this.database.delete(schema_2.like).where((0, drizzle_orm_1.eq)(schema_2.like.id, existingLike.id));
        }
        else {
            await this.database.insert(schema_2.like).values({
                postId,
                userId,
            });
        }
    }
    async savePost(postId, userId) {
        const existingSave = await this.database.query.savedPost.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_2.savedPost.postId, postId), (0, drizzle_orm_1.eq)(schema_2.savedPost.userId, userId)),
        });
        if (existingSave) {
            await this.database
                .delete(schema_2.savedPost)
                .where((0, drizzle_orm_1.eq)(schema_2.savedPost.id, existingSave.id));
        }
        else {
            await this.database.insert(schema_2.savedPost).values({
                postId,
                userId,
                createdAt: new Date(),
            });
        }
    }
    async getSavedPosts(userId) {
        const saved = await this.database.query.savedPost.findMany({
            where: (0, drizzle_orm_1.eq)(schema_2.savedPost.userId, userId),
            with: {
                post: {
                    with: {
                        user: true,
                        likes: true,
                        comments: true,
                    },
                },
            },
            orderBy: [(0, drizzle_orm_1.desc)(schema_2.savedPost.createdAt)],
        });
        return saved.map((item) => ({
            id: item.post.id,
            user: {
                id: item.post.user.id,
                username: item.post.user.name,
                avatar: item.post.user.image || '',
            },
            image: item.post.image,
            caption: item.post.caption,
            likes: item.post.likes.length,
            timestamp: item.post.createdAt.toISOString(),
            comments: item.post.comments.length,
            isLiked: item.post.likes.some((likeItem) => likeItem.userId === userId),
            isSaved: true,
        }));
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_connection_1.DATABASE_CONNECTION)),
    __metadata("design:paramtypes", [node_postgres_1.NodePgDatabase,
        users_service_1.UsersService])
], PostsService);
//# sourceMappingURL=posts.service.js.map