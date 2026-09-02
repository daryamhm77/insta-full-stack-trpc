"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = exports.getCommentsSchema = exports.deleteCommentSchema = exports.createCommentSchema = void 0;
const zod_1 = require("zod");
exports.createCommentSchema = zod_1.z.object({
    postId: zod_1.z.number(),
    text: zod_1.z.string().min(1, "Comment cannot be empty"),
});
exports.deleteCommentSchema = zod_1.z.object({
    commentId: zod_1.z.number(),
});
exports.getCommentsSchema = zod_1.z.object({
    postId: zod_1.z.number(),
});
exports.commentSchema = zod_1.z.object({
    id: zod_1.z.number(),
    text: zod_1.z.string(),
    user: zod_1.z.object({
        username: zod_1.z.string(),
        id: zod_1.z.string(),
        avatar: zod_1.z.string(),
    }),
    createdAt: zod_1.z.string(),
});
