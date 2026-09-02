import type { AppContext } from '../app-context.interface';
import { StoriesService } from './stories.service';
import type { CreateStoryInput } from '@repo/trpc/schemas';
export declare class StoriesRouter {
    private readonly storiesService;
    constructor(storiesService: StoriesService);
    create(createStoryInput: CreateStoryInput, context: AppContext): Promise<void>;
    getStories(context: AppContext): Promise<{
        userId: string;
        username: string;
        avatar: string;
        stories: {
            id: number;
            user: {
                id: string;
                username: string;
                avatar: string;
            };
            image: string;
            createdAt: string;
            expiresAt: string;
        }[];
    }[]>;
}
