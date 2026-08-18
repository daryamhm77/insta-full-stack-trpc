import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { UsersService } from '../auth/users/users.service';
import { DATABASE_CONNECTION } from '../db/database-connection';
import * as schema from '../db/schema';
import { like, post } from '../db/schema';
import type { CreatePostInput, Post } from '@repo/trpc/schemas';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly usersService: UsersService,
  ) {}

  async create(createPostInput: CreatePostInput, userId: string) {
    await this.database.insert(post).values({
      userId,
      caption: createPostInput.caption,
      image: createPostInput.image,
      createdAt: new Date(),
    });
  }

  async findAll(userId: string): Promise<Post[]> {
    const posts = await this.database.query.post.findMany({
      with: {
        user: true,
        likes: true,
      },
      orderBy: [desc(post.createdAt)],
    });

    return posts.map((savedPost) => ({
      id: savedPost.id,
      user: {
        username: savedPost.user.name,
        id: savedPost.user.id,
        avatar: savedPost.user.image || '',
      },
      image: savedPost.image,
      caption: savedPost.caption,
      likes: savedPost.likes.length,
      comments: 0,
      timestamp: savedPost.createdAt.toISOString(),
      isLiked: savedPost.likes.some((item) => item.userId === userId),
    }));
  }

  async likePost(postId: number, userId: string) {
    const existingLike = await this.database.query.like.findFirst({
      where: and(eq(like.postId, postId), eq(like.userId, userId)),
    });

    if (existingLike) {
      await this.database.delete(like).where(eq(like.id, existingLike.id));
    } else {
      await this.database.insert(like).values({
        postId,
        userId,
      });
    }
  }
}
