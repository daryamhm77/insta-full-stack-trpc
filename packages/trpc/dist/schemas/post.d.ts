import { z } from "zod";
export declare const createPostSchema: z.ZodObject<{
    image: z.ZodString;
    caption: z.ZodString;
}, z.core.$strip>;
export declare const findAllPostsSchema: z.ZodObject<{
    userId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const postSchema: z.ZodObject<{
    id: z.ZodNumber;
    user: z.ZodObject<{
        username: z.ZodString;
        id: z.ZodString;
        avatar: z.ZodString;
    }, z.core.$strip>;
    image: z.ZodString;
    caption: z.ZodString;
    likes: z.ZodNumber;
    comments: z.ZodNumber;
    timestamp: z.ZodString;
    isLiked: z.ZodOptional<z.ZodBoolean>;
    isSaved: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const likePostSchema: z.ZodObject<{
    postId: z.ZodNumber;
}, z.core.$strip>;
export declare const savePostSchema: z.ZodObject<{
    postId: z.ZodNumber;
}, z.core.$strip>;
export type Post = z.infer<typeof postSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type LikePostInput = z.infer<typeof likePostSchema>;
export type SavePostInput = z.infer<typeof savePostSchema>;
export type FindAllPostsInput = z.infer<typeof findAllPostsSchema>;
//# sourceMappingURL=post.d.ts.map