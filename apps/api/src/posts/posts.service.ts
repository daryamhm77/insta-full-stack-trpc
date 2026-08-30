import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { CreatePostInput, Post } from '@repo/trpc/schemas';
import { follow } from '../auth/schema';
import { UsersService } from '../auth/users/users.service';
import { DATABASE_CONNECTION } from '../db/database-connection';
import * as schema from '../db/schema';
import { like, post, savedPost } from '../db/schema';

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

  async findAll(userId: string, postUserId?: string): Promise<Post[]> {
    const posts = await this.database.query.post.findMany({
      with: {
        user: true,
        likes: true,
        comments: true,
      },
      where: postUserId
        ? eq(post.userId, postUserId)
        : inArray(post.userId, await this.getFollowedUserIds(userId)),
      orderBy: [desc(post.createdAt)],
    });

    const saved = await this.getSavedPosts(userId);
    const savedIds = new Set(saved.map((item) => item.id));

    return posts.map((item) => ({
      id: item.id,
      user: {
        username: item.user.name,
        id: item.user.id,
        avatar: item.user.image || '',
      },
      image: item.image,
      caption: item.caption,
      likes: item.likes.length,
      comments: item.comments.length,
      timestamp: item.createdAt.toISOString(),
      isLiked: item.likes.some((likeItem) => likeItem.userId === userId),
      isSaved: savedIds.has(item.id),
    }));
  }

  private async getFollowedUserIds(userId: string) {
    const following = await this.database
      .select({ id: follow.followingId })
      .from(follow)
      .where(eq(follow.followerId, userId));
    return [userId, ...following.map((f) => f.id)];
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

  async savePost(postId: number, userId: string) {
    const existingSave = await this.database.query.savedPost.findFirst({
      where: and(eq(savedPost.postId, postId), eq(savedPost.userId, userId)),
    });

    if (existingSave) {
      await this.database
        .delete(savedPost)
        .where(eq(savedPost.id, existingSave.id));
    } else {
      await this.database.insert(savedPost).values({
        postId,
        userId,
        createdAt: new Date(),
      });
    }
  }

  async getSavedPosts(userId: string): Promise<Post[]> {
    const saved = await this.database.query.savedPost.findMany({
      where: eq(savedPost.userId, userId),
      with: {
        post: {
          with: {
            user: true,
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: [desc(savedPost.createdAt)],
    });

    return saved.map((item) => ({
      id: item.post.id,
      user: {
        id: item.post.user.id,
        username: item.post.user.name,
        avatar: item.post.user.image || '',
      },
      image: item.post.image,
      caption: item.post.caption,
      likes: item.post.likes.length,
      timestamp: item.post.createdAt.toISOString(),
      comments: item.post.comments.length,
      isLiked: item.post.likes.some((likeItem) => likeItem.userId === userId),
      isSaved: true,
    }));
  }
}
