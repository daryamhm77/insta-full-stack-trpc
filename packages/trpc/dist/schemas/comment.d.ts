import { z } from "zod";
export declare const createCommentSchema: z.ZodObject<{
    postId: z.ZodNumber;
    text: z.ZodString;
}, z.core.$strip>;
export declare const deleteCommentSchema: z.ZodObject<{
    commentId: z.ZodNumber;
}, z.core.$strip>;
export declare const getCommentsSchema: z.ZodObject<{
    postId: z.ZodNumber;
}, z.core.$strip>;
export declare const commentSchema: z.ZodObject<{
    id: z.ZodNumber;
    text: z.ZodString;
    user: z.ZodObject<{
        username: z.ZodString;
        id: z.ZodString;
        avatar: z.ZodString;
    }, z.core.$strip>;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type Comment = z.infer<typeof commentSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type DeleteCommentInput = z.infer<typeof deleteCommentSchema>;
export type GetCommentsInput = z.infer<typeof getCommentsSchema>;
//# sourceMappingURL=comment.d.ts.map