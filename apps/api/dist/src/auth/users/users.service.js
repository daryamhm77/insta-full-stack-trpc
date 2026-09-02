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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const database_connection_1 = require("../../db/database-connection");
const schema_1 = require("../schema");
let UsersService = class UsersService {
    database;
    constructor(database) {
        this.database = database;
    }
    profileSelect(currentUserId) {
        return {
            id: schema_1.user.id,
            name: schema_1.user.name,
            image: schema_1.user.image,
            bio: schema_1.user.bio,
            website: schema_1.user.website,
            followerCount: (0, drizzle_orm_1.sql) `(
        SELECT COUNT(*)::int
        FROM "follow" f
        WHERE f.following_id = "user"."id"
      )`,
            followingCount: (0, drizzle_orm_1.sql) `(
        SELECT COUNT(*)::int
        FROM "follow" f
        WHERE f.follower_id = "user"."id"
      )`,
            postCount: (0, drizzle_orm_1.sql) `(
        SELECT COUNT(*)::int
        FROM "post" p
        WHERE p.user_id = "user"."id"
      )`,
            isFollowing: (0, drizzle_orm_1.sql) `EXISTS(
        SELECT 1
        FROM "follow" f
        WHERE f.follower_id = ${currentUserId}
          AND f.following_id = "user"."id"
      )`,
        };
    }
    async findById(userId) {
        const foundUser = await this.database.query.user.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.user.id, userId),
        });
        if (!foundUser) {
            throw new common_1.NotFoundException('User not found');
        }
        return foundUser;
    }
    async follow(followerId, followingId) {
        if (followerId === followingId) {
            throw new Error('Cannot follow yourself');
        }
        const existingFollow = await this.database.query.follow.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.follow.followerId, followerId), (0, drizzle_orm_1.eq)(schema_1.follow.followingId, followingId)),
        });
        if (existingFollow) {
            throw new Error('Already following this user');
        }
        await this.database.insert(schema_1.follow).values({
            followerId,
            followingId,
        });
    }
    async unfollow(followerId, followingId) {
        const existingFollow = await this.database.query.follow.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.follow.followerId, followerId), (0, drizzle_orm_1.eq)(schema_1.follow.followingId, followingId)),
        });
        if (!existingFollow) {
            throw new Error('Not following this user');
        }
        await this.database
            .delete(schema_1.follow)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.follow.followerId, followerId), (0, drizzle_orm_1.eq)(schema_1.follow.followingId, followingId)));
    }
    async getFollowers(userId, currentUserId) {
        return this.database
            .select(this.profileSelect(currentUserId))
            .from(schema_1.follow)
            .innerJoin(schema_1.user, (0, drizzle_orm_1.eq)(schema_1.follow.followerId, schema_1.user.id))
            .where((0, drizzle_orm_1.eq)(schema_1.follow.followingId, userId));
    }
    async getFollowing(userId, currentUserId) {
        return this.database
            .select(this.profileSelect(currentUserId))
            .from(schema_1.follow)
            .innerJoin(schema_1.user, (0, drizzle_orm_1.eq)(schema_1.follow.followingId, schema_1.user.id))
            .where((0, drizzle_orm_1.eq)(schema_1.follow.followerId, userId));
    }
    async getSuggestedUsers(userId) {
        const followingIds = await this.database.query.follow.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.follow.followerId, userId),
        });
        const followingIdsList = followingIds.map((f) => f.followingId);
        return this.database
            .select(this.profileSelect(userId))
            .from(schema_1.user)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ne)(schema_1.user.id, userId), followingIdsList.length > 0
            ? (0, drizzle_orm_1.notInArray)(schema_1.user.id, followingIdsList)
            : undefined))
            .limit(5);
    }
    async getUserProfile(userId, currentUserId) {
        const result = await this.database
            .select(this.profileSelect(currentUserId))
            .from(schema_1.user)
            .where((0, drizzle_orm_1.eq)(schema_1.user.id, userId));
        return result[0] || null;
    }
    async updateProfile(userId, updates) {
        await this.database.update(schema_1.user).set(updates).where((0, drizzle_orm_1.eq)(schema_1.user.id, userId));
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_connection_1.DATABASE_CONNECTION)),
    __metadata("design:paramtypes", [node_postgres_1.NodePgDatabase])
], UsersService);
//# sourceMappingURL=users.service.js.map