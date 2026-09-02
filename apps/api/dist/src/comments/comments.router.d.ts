import type { AppContext } from '../app-context.interface';
import { CommentsService } from './comments.service';
import type { CreateCommentInput, DeleteCommentInput, GetCommentsInput } from '@repo/trpc/schemas';
export declare class CommentsRouter {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(createCommentInput: CreateCommentInput, context: AppContext): Promise<void>;
    findByPostId(getCommentsInput: GetCommentsInput): Promise<{
        id: number;
        text: string;
        user: {
            username: string;
            id: string;
            avatar: string;
        };
        createdAt: string;
    }[]>;
    delete(deleteCommentInput: DeleteCommentInput, context: AppContext): Promise<void>;
}
