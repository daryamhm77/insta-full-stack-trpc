import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { CreateCommentInput } from '@repo/trpc/schemas';
import { DATABASE_CONNECTION } from '../db/database-connection';
import * as schema from '../db/schema';
import { comment } from './schemas/schema';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async create(createCommentInput: CreateCommentInput, userId: string) {
    await this.database.insert(comment).values({
      userId,
      text: createCommentInput.text,
      postId: createCommentInput.postId,
      createdAt: new Date(),
    });
  }

  async findByPostId(postId: number) {
    const comments = await this.database.query.comment.findMany({
      where: eq(comment.postId, postId),
      with: {
        user: true,
      },
    });

    return comments.map((item) => ({
      id: item.id,
      text: item.text,
      user: {
        username: item.user.name,
        id: item.user.id,
        avatar: item.user.image || '',
      },
      createdAt: item.createdAt.toISOString(),
    }));
  }

  async delete(commentId: number, userId: string) {
    await this.database
      .delete(comment)
      .where(and(eq(comment.id, commentId), eq(comment.userId, userId)));
  }
}
