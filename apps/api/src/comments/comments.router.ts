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
import { CommentsService } from './comments.service';
import {
  commentSchema,
  createCommentSchema,
  deleteCommentSchema,
  getCommentsSchema,
} from '@repo/trpc/schemas';
import type {
  CreateCommentInput,
  DeleteCommentInput,
  GetCommentsInput,
} from '@repo/trpc/schemas';

@Router({ alias: 'comments' })
@UseMiddlewares(AuthTrpcMiddleware)
export class CommentsRouter {
  constructor(
    @Inject(CommentsService) private readonly commentsService: CommentsService,
  ) {}

  @Mutation({ input: createCommentSchema })
  create(
    @Input() createCommentInput: CreateCommentInput,
    @Ctx() context: AppContext,
  ) {
    return this.commentsService.create(createCommentInput, context.user.id);
  }

  @Query({ input: getCommentsSchema, output: z.array(commentSchema) })
  findByPostId(@Input() getCommentsInput: GetCommentsInput) {
    return this.commentsService.findByPostId(getCommentsInput.postId);
  }

  @Mutation({ input: deleteCommentSchema })
  delete(
    @Input() deleteCommentInput: DeleteCommentInput,
    @Ctx() context: AppContext,
  ) {
    return this.commentsService.delete(
      deleteCommentInput.commentId,
      context.user.id,
    );
  }
}
