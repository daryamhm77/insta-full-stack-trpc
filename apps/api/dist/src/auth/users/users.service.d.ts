import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { UpdateProfileInput, UserProfile } from '@repo/trpc/schemas';
import * as schema from '../../db/schema';
export declare class UsersService {
    private readonly database;
    constructor(database: NodePgDatabase<typeof schema>);
    private profileSelect;
    findById(userId: string): Promise<{
        id: string;
        image: string | null;
        createdAt: Date;
        name: string;
        email: string;
        emailVerified: boolean;
        bio: string | null;
        website: string | null;
        updatedAt: Date;
    }>;
    follow(followerId: string, followingId: string): Promise<void>;
    unfollow(followerId: string, followingId: string): Promise<void>;
    getFollowers(userId: string, currentUserId: string): Promise<{
        id: string;
        name: string;
        image: string | null;
        bio: string | null;
        website: string | null;
        followerCount: number;
        followingCount: number;
        postCount: number;
        isFollowing: boolean;
    }[]>;
    getFollowing(userId: string, currentUserId: string): Promise<{
        id: string;
        name: string;
        image: string | null;
        bio: string | null;
        website: string | null;
        followerCount: number;
        followingCount: number;
        postCount: number;
        isFollowing: boolean;
    }[]>;
    getSuggestedUsers(userId: string): Promise<{
        id: string;
        name: string;
        image: string | null;
        bio: string | null;
        website: string | null;
        followerCount: number;
        followingCount: number;
        postCount: number;
        isFollowing: boolean;
    }[]>;
    getUserProfile(userId: string, currentUserId: string): Promise<UserProfile>;
    updateProfile(userId: string, updates: UpdateProfileInput): Promise<void>;
}
