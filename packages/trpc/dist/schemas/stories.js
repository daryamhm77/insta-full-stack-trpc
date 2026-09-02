"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyGroupSchema = exports.storySchema = exports.createStorySchema = void 0;
const zod_1 = require("zod");
exports.createStorySchema = zod_1.z.object({
    image: zod_1.z.string().min(1, "Image is required"),
});
exports.storySchema = zod_1.z.object({
    id: zod_1.z.number(),
    user: zod_1.z.object({
        id: zod_1.z.string(),
        username: zod_1.z.string(),
        avatar: zod_1.z.string(),
    }),
    image: zod_1.z.string(),
    createdAt: zod_1.z.string(),
    expiresAt: zod_1.z.string(),
});
exports.storyGroupSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    username: zod_1.z.string(),
    avatar: zod_1.z.string(),
    stories: zod_1.z.array(exports.storySchema),
});
