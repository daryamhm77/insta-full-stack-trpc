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
exports.StoriesService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const schema_1 = require("../auth/schema");
const database_connection_1 = require("../db/database-connection");
const schema_2 = require("./schemas/schema");
let StoriesService = class StoriesService {
    database;
    constructor(database) {
        this.database = database;
    }
    async create(createStoryInput, userId) {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        await this.database.insert(schema_2.story).values({
            userId,
            image: createStoryInput.image,
            createdAt: new Date(),
            expiresAt,
        });
    }
    async getStories(userId) {
        const followingIds = await this.database
            .select({ id: schema_1.follow.followingId })
            .from(schema_1.follow)
            .where((0, drizzle_orm_1.eq)(schema_1.follow.followerId, userId));
        const userIds = [userId, ...followingIds.map((f) => f.id)];
        const stories = await this.database.query.story.findMany({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.gt)(schema_2.story.expiresAt, new Date()), (0, drizzle_orm_1.inArray)(schema_2.story.userId, userIds)),
            with: {
                user: true,
            },
        });
        const storyGroups = new Map();
        for (const item of stories) {
            if (!storyGroups.has(item.userId)) {
                storyGroups.set(item.userId, {
                    userId: item.userId,
                    username: item.user.name,
                    avatar: item.user.image || '',
                    stories: [],
                });
            }
            const group = storyGroups.get(item.userId);
            group?.stories.push({
                id: item.id,
                user: {
                    id: item.user.id,
                    username: item.user.name,
                    avatar: item.user.image || '',
                },
                image: item.image,
                createdAt: item.createdAt.toISOString(),
                expiresAt: item.expiresAt.toISOString(),
            });
        }
        return Array.from(storyGroups.values());
    }
};
exports.StoriesService = StoriesService;
exports.StoriesService = StoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_connection_1.DATABASE_CONNECTION)),
    __metadata("design:paramtypes", [node_postgres_1.NodePgDatabase])
], StoriesService);
//# sourceMappingURL=stories.service.js.map