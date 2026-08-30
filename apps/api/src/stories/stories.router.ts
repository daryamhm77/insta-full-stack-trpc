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
import { StoriesService } from './stories.service';
import { createStorySchema, storyGroupSchema } from '@repo/trpc/schemas';
import type { CreateStoryInput } from '@repo/trpc/schemas';

@Router({ alias: 'stories' })
@UseMiddlewares(AuthTrpcMiddleware)
export class StoriesRouter {
  constructor(
    @Inject(StoriesService) private readonly storiesService: StoriesService,
  ) {}

  @Mutation({ input: createStorySchema })
  create(
    @Input() createStoryInput: CreateStoryInput,
    @Ctx() context: AppContext,
  ) {
    return this.storiesService.create(createStoryInput, context.user.id);
  }

  @Query({ output: z.array(storyGroupSchema) })
  getStories(@Ctx() context: AppContext) {
    return this.storiesService.getStories(context.user.id);
  }
}
