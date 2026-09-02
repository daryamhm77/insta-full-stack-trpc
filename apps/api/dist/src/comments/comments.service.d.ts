import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { CreateCommentInput } from '@repo/trpc/schemas';
import * as schema from '../db/schema';
export declare class CommentsService {
    private readonly database;
    constructor(database: NodePgDatabase<typeof schema>);
    create(createCommentInput: CreateCommentInput, userId: string): Promise<void>;
    findByPostId(postId: number): Promise<{
        id: number;
        text: string;
        user: {
            username: string;
            id: string;
            avatar: string;
        };
        createdAt: string;
    }[]>;
    delete(commentId: number, userId: string): Promise<void>;
}
