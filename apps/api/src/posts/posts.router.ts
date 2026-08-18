import { Inject } from '@nestjs/common';
import {
  Router,
  Query,
  Mutation,
  Input,
  Ctx,
  UseMiddlewares,
} from 'nestjs-trpc';
import { z } from 'zod';
import { AuthTrpcMiddleware } from '../auth/auth-trpc.middleware';
import type { AppContext } from '../app-context.interface';
import { PostsService } from './posts.service';
import {
  createPostSchema,
  likePostSchema,
  postSchema,
} from '@repo/trpc/schemas';
import type { CreatePostInput, LikePostInput } from '@repo/trpc/schemas';

@Router({ alias: 'posts' })
@UseMiddlewares(AuthTrpcMiddleware)
export class PostsRouter {
  constructor(@Inject(PostsService) private readonly postsService: PostsService) {}

  @Query({ output: z.array(postSchema) })
  findAll(@Ctx() context: AppContext) {
    return this.postsService.findAll(context.user.id);
  }

  @Mutation({ input: createPostSchema })
  create(
    @Input() input: CreatePostInput,
    @Ctx() context: AppContext,
  ) {
    return this.postsService.create(input, context.user.id);
  }

  @Mutation({ input: likePostSchema })
  likePost(
    @Input() likePostInput: LikePostInput,
    @Ctx() context: AppContext,
  ) {
    return this.postsService.likePost(likePostInput.postId, context.user.id);
  }
}
