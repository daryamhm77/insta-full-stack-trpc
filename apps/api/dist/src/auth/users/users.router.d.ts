import type { AppContext } from '../../app-context.interface';
import { UsersService } from './users.service';
import type { UpdateProfileInput, UserIdInput } from '@repo/trpc/schemas';
export declare class UsersRouter {
    private readonly usersService;
    constructor(usersService: UsersService);
    follow(input: UserIdInput, context: AppContext): Promise<void>;
    unfollow(input: UserIdInput, context: AppContext): Promise<void>;
    getFollowers(input: UserIdInput, context: AppContext): Promise<{
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
    getFollowing(input: UserIdInput, context: AppContext): Promise<{
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
    getSuggestedUsers(context: AppContext): Promise<{
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
    updateProfile(input: UpdateProfileInput, context: AppContext): Promise<void>;
    getUserProfile(input: UserIdInput, context: AppContext): Promise<{
        id: string;
        name: string;
        bio: string | null;
        website: string | null;
        image: string | null;
        followerCount: number;
        followingCount: number;
        postCount: number;
        isFollowing: boolean;
    }>;
}
