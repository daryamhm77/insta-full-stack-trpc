import { initTRPC } from "@trpc/server";
import { z } from "zod";
import {
  commentSchema,
  createCommentSchema,
  deleteCommentSchema,
  getCommentsSchema,
} from "../schemas/comment";
import {
  createPostSchema,
  findAllPostsSchema,
  likePostSchema,
  postSchema,
  savePostSchema,
} from "../schemas/post";
import {
  createStorySchema,
  storyGroupSchema,
} from "../schemas/stories";
import {
  updateProfileSchema,
  userIdSchema,
  userProfileSchema,
} from "../schemas/user";

const t = initTRPC.create();

export const publicProcedure = t.procedure;
export const router = t.router;

/**
 * Client-facing AppRouter shape.
 * NestJS (nestjs-trpc) implements these procedures at runtime;
 * placeholders here keep frontend types in sync.
 */
export const appRouter = router({
  posts: router({
    findAll: publicProcedure
      .input(findAllPostsSchema)
      .output(z.array(postSchema))
      .query(async () => [] as z.infer<typeof postSchema>[]),
    create: publicProcedure
      .input(createPostSchema)
      .mutation(async () => undefined as void),
    likePost: publicProcedure
      .input(likePostSchema)
      .mutation(async () => undefined as void),
    savePost: publicProcedure
      .input(savePostSchema)
      .mutation(async () => undefined as void),
    getSavedPosts: publicProcedure
      .output(z.array(postSchema))
      .query(async () => [] as z.infer<typeof postSchema>[]),
  }),
  comments: router({
    create: publicProcedure
      .input(createCommentSchema)
      .mutation(async () => undefined as void),
    findByPostId: publicProcedure
      .input(getCommentsSchema)
      .output(z.array(commentSchema))
      .query(async () => [] as z.infer<typeof commentSchema>[]),
    delete: publicProcedure
      .input(deleteCommentSchema)
      .mutation(async () => undefined as void),
  }),
  stories: router({
    create: publicProcedure
      .input(createStorySchema)
      .mutation(async () => undefined as void),
    getStories: publicProcedure
      .output(z.array(storyGroupSchema))
      .query(async () => [] as z.infer<typeof storyGroupSchema>[]),
  }),
  users: router({
    follow: publicProcedure
      .input(userIdSchema)
      .mutation(async () => undefined as void),
    unfollow: publicProcedure
      .input(userIdSchema)
      .mutation(async () => undefined as void),
    getFollowers: publicProcedure
      .input(userIdSchema)
      .output(z.array(userProfileSchema))
      .query(async () => [] as z.infer<typeof userProfileSchema>[]),
    getFollowing: publicProcedure
      .input(userIdSchema)
      .output(z.array(userProfileSchema))
      .query(async () => [] as z.infer<typeof userProfileSchema>[]),
    getSuggestedUsers: publicProcedure
      .output(z.array(userProfileSchema))
      .query(async () => [] as z.infer<typeof userProfileSchema>[]),
    updateProfile: publicProcedure
      .input(updateProfileSchema)
      .mutation(async () => undefined as void),
    getUserProfile: publicProcedure
      .input(userIdSchema)
      .output(userProfileSchema)
      .query(async () => null as unknown as z.infer<typeof userProfileSchema>),
  }),
});

export type AppRouter = typeof appRouter;
