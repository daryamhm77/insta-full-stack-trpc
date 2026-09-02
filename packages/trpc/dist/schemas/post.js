"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePostSchema = exports.likePostSchema = exports.postSchema = exports.findAllPostsSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = zod_1.z.object({
    image: zod_1.z.string().min(1, "Image is required"),
    caption: zod_1.z.string().min(1, "Caption is required"),
});
exports.findAllPostsSchema = zod_1.z.object({
    userId: zod_1.z.string().optional(),
});
exports.postSchema = zod_1.z.object({
    id: zod_1.z.number(),
    user: zod_1.z.object({
        username: zod_1.z.string(),
        id: zod_1.z.string(),
        avatar: zod_1.z.string(),
    }),
    image: zod_1.z.string(),
    caption: zod_1.z.string(),
    likes: zod_1.z.number(),
    comments: zod_1.z.number(),
    timestamp: zod_1.z.string(),
    isLiked: zod_1.z.boolean().optional(),
    isSaved: zod_1.z.boolean().optional(),
});
exports.likePostSchema = zod_1.z.object({
    postId: zod_1.z.number(),
});
exports.savePostSchema = zod_1.z.object({
    postId: zod_1.z.number(),
});
