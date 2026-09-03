import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq, ilike, ne, notInArray, or, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { UpdateProfileInput, UserProfile } from '@repo/trpc/schemas';
import { DATABASE_CONNECTION } from '../../db/database-connection';
import * as schema from '../../db/schema';
import { follow, user } from '../schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  private profileSelect(currentUserId: string) {
    return {
      id: user.id,
      name: user.name,
      image: user.image,
      bio: user.bio,
      website: user.website,
      followerCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM "follow" f
        WHERE f.following_id = "user"."id"
      )`,
      followingCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM "follow" f
        WHERE f.follower_id = "user"."id"
      )`,
      postCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM "post" p
        WHERE p.user_id = "user"."id"
      )`,
      isFollowing: sql<boolean>`EXISTS(
        SELECT 1
        FROM "follow" f
        WHERE f.follower_id = ${currentUserId}
          AND f.following_id = "user"."id"
      )`,
    };
  }

  async findById(userId: string) {
    const foundUser = await this.database.query.user.findFirst({
      where: eq(user.id, userId),
    });

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return foundUser;
  }

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new Error('Cannot follow yourself');
    }

    const existingFollow = await this.database.query.follow.findFirst({
      where: and(
        eq(follow.followerId, followerId),
        eq(follow.followingId, followingId),
      ),
    });

    if (existingFollow) {
      throw new Error('Already following this user');
    }

    await this.database.insert(follow).values({
      followerId,
      followingId,
    });
  }

  async unfollow(followerId: string, followingId: string) {
    const existingFollow = await this.database.query.follow.findFirst({
      where: and(
        eq(follow.followerId, followerId),
        eq(follow.followingId, followingId),
      ),
    });

    if (!existingFollow) {
      throw new Error('Not following this user');
    }

    await this.database
      .delete(follow)
      .where(
        and(
          eq(follow.followerId, followerId),
          eq(follow.followingId, followingId),
        ),
      );
  }

  async getFollowers(userId: string, currentUserId: string) {
    return this.database
      .select(this.profileSelect(currentUserId))
      .from(follow)
      .innerJoin(user, eq(follow.followerId, user.id))
      .where(eq(follow.followingId, userId));
  }

  async getFollowing(userId: string, currentUserId: string) {
    return this.database
      .select(this.profileSelect(currentUserId))
      .from(follow)
      .innerJoin(user, eq(follow.followingId, user.id))
      .where(eq(follow.followerId, userId));
  }

  async getSuggestedUsers(userId: string) {
    const followingIds = await this.database.query.follow.findMany({
      where: eq(follow.followerId, userId),
    });
    const followingIdsList = followingIds.map((f) => f.followingId);

    return this.database
      .select(this.profileSelect(userId))
      .from(user)
      .where(
        and(
          ne(user.id, userId),
          followingIdsList.length > 0
            ? notInArray(user.id, followingIdsList)
            : undefined,
        ),
      )
      .limit(5);
  }

  async searchUsers(query: string, currentUserId: string) {
    const trimmed = query.trim().replace(/[%_]/g, ' ').replace(/\s+/g, ' ');
    if (!trimmed) {
      return [];
    }

    const pattern = `%${trimmed}%`;
    const rows = await this.database
      .select(this.profileSelect(currentUserId))
      .from(user)
      .where(or(ilike(user.name, pattern), ilike(user.email, pattern)))
      .limit(12);

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      bio: row.bio ?? null,
      website: row.website ?? null,
      image: row.image ?? null,
      followerCount: Number(row.followerCount ?? 0),
      followingCount: Number(row.followingCount ?? 0),
      postCount: Number(row.postCount ?? 0),
      isFollowing: Boolean(row.isFollowing),
    }));
  }

  async getUserProfile(
    userId: string,
    currentUserId: string,
  ): Promise<UserProfile> {
    const result = await this.database
      .select(this.profileSelect(currentUserId))
      .from(user)
      .where(eq(user.id, userId));

    return result[0] || null;
  }

  async updateProfile(userId: string, updates: UpdateProfileInput) {
    await this.database.update(user).set(updates).where(eq(user.id, userId));
  }
}
