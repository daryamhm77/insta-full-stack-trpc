import type { AppContext } from '../app-context.interface';
import { PostsService } from './posts.service';
import type { CreatePostInput, FindAllPostsInput, LikePostInput, SavePostInput } from '@repo/trpc/schemas';
export declare class PostsRouter {
    private readonly postsService;
    constructor(postsService: PostsService);
    findAll(context: AppContext, input: FindAllPostsInput): Promise<{
        id: number;
        user: {
            username: string;
            id: string;
            avatar: string;
        };
        image: string;
        caption: string;
        likes: number;
        comments: number;
        timestamp: string;
        isLiked?: boolean | undefined;
        isSaved?: boolean | undefined;
    }[]>;
    create(input: CreatePostInput, context: AppContext): Promise<void>;
    likePost(likePostInput: LikePostInput, context: AppContext): Promise<void>;
    savePost(savePostInput: SavePostInput, context: AppContext): Promise<void>;
    getSavedPosts(context: AppContext): Promise<{
        id: number;
        user: {
            username: string;
            id: string;
            avatar: string;
        };
        image: string;
        caption: string;
        likes: number;
        comments: number;
        timestamp: string;
        isLiked?: boolean | undefined;
        isSaved?: boolean | undefined;
    }[]>;
}
