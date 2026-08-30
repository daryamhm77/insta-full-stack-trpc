import { Inject, Injectable } from '@nestjs/common';
import { and, eq, gt, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { CreateStoryInput, StoryGroup } from '@repo/trpc/schemas';
import { follow } from '../auth/schema';
import { DATABASE_CONNECTION } from '../db/database-connection';
import * as schema from '../db/schema';
import { story } from './schemas/schema';

@Injectable()
export class StoriesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async create(createStoryInput: CreateStoryInput, userId: string) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await this.database.insert(story).values({
      userId,
      image: createStoryInput.image,
      createdAt: new Date(),
      expiresAt,
    });
  }

  async getStories(userId: string): Promise<StoryGroup[]> {
    const followingIds = await this.database
      .select({ id: follow.followingId })
      .from(follow)
      .where(eq(follow.followerId, userId));

    const userIds = [userId, ...followingIds.map((f) => f.id)];

    const stories = await this.database.query.story.findMany({
      where: and(
        gt(story.expiresAt, new Date()),
        inArray(story.userId, userIds),
      ),
      with: {
        user: true,
      },
    });

    const storyGroups = new Map<string, StoryGroup>();

    for (const item of stories) {
      if (!storyGroups.has(item.userId)) {
        storyGroups.set(item.userId, {
          userId: item.userId,
          username: item.user.name,
          avatar: item.user.image || '',
          stories: [],
        });
      }

      const group = storyGroups.get(item.userId);

      group?.stories.push({
        id: item.id,
        user: {
          id: item.user.id,
          username: item.user.name,
          avatar: item.user.image || '',
        },
        image: item.image,
        createdAt: item.createdAt.toISOString(),
        expiresAt: item.expiresAt.toISOString(),
      });
    }

    return Array.from(storyGroups.values());
  }
}
