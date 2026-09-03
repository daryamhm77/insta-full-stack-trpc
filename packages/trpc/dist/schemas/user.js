"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfileSchema = exports.updateProfileSchema = exports.searchUsersSchema = exports.userIdSchema = void 0;
const zod_1 = require("zod");
exports.userIdSchema = zod_1.z.object({
    userId: zod_1.z.string(),
});
exports.searchUsersSchema = zod_1.z.object({
    query: zod_1.z.string().trim().min(1).max(50),
});
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    website: zod_1.z.string().optional(),
});
exports.userProfileSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    bio: zod_1.z.string().nullable(),
    website: zod_1.z.string().nullable(),
    image: zod_1.z.string().nullable(),
    followerCount: zod_1.z.number(),
    followingCount: zod_1.z.number(),
    postCount: zod_1.z.number(),
    isFollowing: zod_1.z.boolean(),
});
