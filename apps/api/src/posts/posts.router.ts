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
  findAllPostsSchema,
  likePostSchema,
  postSchema,
  savePostSchema,
} from '@repo/trpc/schemas';
import type {
  CreatePostInput,
  FindAllPostsInput,
  LikePostInput,
  SavePostInput,
} from '@repo/trpc/schemas';

@Router({ alias: 'posts' })
@UseMiddlewares(AuthTrpcMiddleware)
export class PostsRouter {
  constructor(@Inject(PostsService) private readonly postsService: PostsService) {}

  @Query({ output: z.array(postSchema), input: findAllPostsSchema })
  findAll(
    @Ctx() context: AppContext,
    @Input() input: FindAllPostsInput,
  ) {
    return this.postsService.findAll(context.user.id, input.userId);
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

  @Mutation({ input: savePostSchema })
  savePost(
    @Input() savePostInput: SavePostInput,
    @Ctx() context: AppContext,
  ) {
    return this.postsService.savePost(savePostInput.postId, context.user.id);
  }

  @Query({ output: z.array(postSchema) })
  getSavedPosts(@Ctx() context: AppContext) {
    return this.postsService.getSavedPosts(context.user.id);
  }
}
