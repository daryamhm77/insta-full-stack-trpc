import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { CreatePostInput, Post } from '@repo/trpc/schemas';
import { UsersService } from '../auth/users/users.service';
import * as schema from '../db/schema';
export declare class PostsService {
    private readonly database;
    private readonly usersService;
    constructor(database: NodePgDatabase<typeof schema>, usersService: UsersService);
    create(createPostInput: CreatePostInput, userId: string): Promise<void>;
    findAll(userId: string, postUserId?: string): Promise<Post[]>;
    private getFollowedUserIds;
    likePost(postId: number, userId: string): Promise<void>;
    savePost(postId: number, userId: string): Promise<void>;
    getSavedPosts(userId: string): Promise<Post[]>;
}
