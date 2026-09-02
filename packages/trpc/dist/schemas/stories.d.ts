import { z } from "zod";
export declare const createStorySchema: z.ZodObject<{
    image: z.ZodString;
}, z.core.$strip>;
export declare const storySchema: z.ZodObject<{
    id: z.ZodNumber;
    user: z.ZodObject<{
        id: z.ZodString;
        username: z.ZodString;
        avatar: z.ZodString;
    }, z.core.$strip>;
    image: z.ZodString;
    createdAt: z.ZodString;
    expiresAt: z.ZodString;
}, z.core.$strip>;
export declare const storyGroupSchema: z.ZodObject<{
    userId: z.ZodString;
    username: z.ZodString;
    avatar: z.ZodString;
    stories: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        user: z.ZodObject<{
            id: z.ZodString;
            username: z.ZodString;
            avatar: z.ZodString;
        }, z.core.$strip>;
        image: z.ZodString;
        createdAt: z.ZodString;
        expiresAt: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type Story = z.infer<typeof storySchema>;
export type StoryGroup = z.infer<typeof storyGroupSchema>;
export type CreateStoryInput = z.infer<typeof createStorySchema>;
//# sourceMappingURL=stories.d.ts.map