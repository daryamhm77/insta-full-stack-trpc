import { z } from "zod";
export declare const userIdSchema: z.ZodObject<{
    userId: z.ZodString;
}, z.core.$strip>;
export declare const updateProfileSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const userProfileSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    bio: z.ZodNullable<z.ZodString>;
    website: z.ZodNullable<z.ZodString>;
    image: z.ZodNullable<z.ZodString>;
    followerCount: z.ZodNumber;
    followingCount: z.ZodNumber;
    postCount: z.ZodNumber;
    isFollowing: z.ZodBoolean;
}, z.core.$strip>;
export type UserIdInput = z.infer<typeof userIdSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
//# sourceMappingURL=user.d.ts.map