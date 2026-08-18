import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { createPostSchema, likePostSchema, postSchema } from "../schemas/post";

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
      .output(z.array(postSchema))
      .query(async () => [] as z.infer<typeof postSchema>[]),
    create: publicProcedure
      .input(createPostSchema)
      .mutation(async () => undefined as void),
    likePost: publicProcedure
      .input(likePostSchema)
      .mutation(async () => undefined as void),
  }),
});

export type AppRouter = typeof appRouter;
