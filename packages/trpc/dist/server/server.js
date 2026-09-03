"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = exports.router = exports.publicProcedure = void 0;
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const comment_1 = require("../schemas/comment");
const post_1 = require("../schemas/post");
const stories_1 = require("../schemas/stories");
const user_1 = require("../schemas/user");
const t = server_1.initTRPC.create();
exports.publicProcedure = t.procedure;
exports.router = t.router;
/**
 * Client-facing AppRouter shape.
 * NestJS (nestjs-trpc) implements these procedures at runtime;
 * placeholders here keep frontend types in sync.
 */
exports.appRouter = (0, exports.router)({
    posts: (0, exports.router)({
        findAll: exports.publicProcedure
            .input(post_1.findAllPostsSchema)
            .output(zod_1.z.array(post_1.postSchema))
            .query(async () => []),
        create: exports.publicProcedure
            .input(post_1.createPostSchema)
            .mutation(async () => undefined),
        likePost: exports.publicProcedure
            .input(post_1.likePostSchema)
            .mutation(async () => undefined),
        savePost: exports.publicProcedure
            .input(post_1.savePostSchema)
            .mutation(async () => undefined),
        getSavedPosts: exports.publicProcedure
            .output(zod_1.z.array(post_1.postSchema))
            .query(async () => []),
    }),
    comments: (0, exports.router)({
        create: exports.publicProcedure
            .input(comment_1.createCommentSchema)
            .mutation(async () => undefined),
        findByPostId: exports.publicProcedure
            .input(comment_1.getCommentsSchema)
            .output(zod_1.z.array(comment_1.commentSchema))
            .query(async () => []),
        delete: exports.publicProcedure
            .input(comment_1.deleteCommentSchema)
            .mutation(async () => undefined),
    }),
    stories: (0, exports.router)({
        create: exports.publicProcedure
            .input(stories_1.createStorySchema)
            .mutation(async () => undefined),
        getStories: exports.publicProcedure
            .output(zod_1.z.array(stories_1.storyGroupSchema))
            .query(async () => []),
    }),
    users: (0, exports.router)({
        follow: exports.publicProcedure
            .input(user_1.userIdSchema)
            .mutation(async () => undefined),
        unfollow: exports.publicProcedure
            .input(user_1.userIdSchema)
            .mutation(async () => undefined),
        getFollowers: exports.publicProcedure
            .input(user_1.userIdSchema)
            .output(zod_1.z.array(user_1.userProfileSchema))
            .query(async () => []),
        getFollowing: exports.publicProcedure
            .input(user_1.userIdSchema)
            .output(zod_1.z.array(user_1.userProfileSchema))
            .query(async () => []),
        getSuggestedUsers: exports.publicProcedure
            .output(zod_1.z.array(user_1.userProfileSchema))
            .query(async () => []),
        searchUsers: exports.publicProcedure
            .input(user_1.searchUsersSchema)
            .output(zod_1.z.array(user_1.userProfileSchema))
            .query(async () => []),
        updateProfile: exports.publicProcedure
            .input(user_1.updateProfileSchema)
            .mutation(async () => undefined),
        getUserProfile: exports.publicProcedure
            .input(user_1.userIdSchema)
            .output(user_1.userProfileSchema)
            .query(async () => null),
    }),
});
