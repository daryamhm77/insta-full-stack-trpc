import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { CreateStoryInput, StoryGroup } from '@repo/trpc/schemas';
import * as schema from '../db/schema';
export declare class StoriesService {
    private readonly database;
    constructor(database: NodePgDatabase<typeof schema>);
    create(createStoryInput: CreateStoryInput, userId: string): Promise<void>;
    getStories(userId: string): Promise<StoryGroup[]>;
}
