export declare const publicProcedure: import("@trpc/server").TRPCProcedureBuilder<object, object, object, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const router: import("@trpc/server").TRPCRouterBuilder<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}>;
/**
 * Client-facing AppRouter shape.
 * NestJS (nestjs-trpc) implements these procedures at runtime;
 * placeholders here keep frontend types in sync.
 */
export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    posts: import("@trpc/server").TRPCBuiltRouter<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        findAll: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                userId?: string | undefined;
            };
            output: {
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
            }[];
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                image: string;
                caption: string;
            };
            output: void;
            meta: object;
        }>;
        likePost: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                postId: number;
            };
            output: void;
            meta: object;
        }>;
        savePost: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                postId: number;
            };
            output: void;
            meta: object;
        }>;
        getSavedPosts: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
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
            }[];
            meta: object;
        }>;
    }>>;
    comments: import("@trpc/server").TRPCBuiltRouter<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                postId: number;
                text: string;
            };
            output: void;
            meta: object;
        }>;
        findByPostId: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                postId: number;
            };
            output: {
                id: number;
                text: string;
                user: {
                    username: string;
                    id: string;
                    avatar: string;
                };
                createdAt: string;
            }[];
            meta: object;
        }>;
        delete: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                commentId: number;
            };
            output: void;
            meta: object;
        }>;
    }>>;
    stories: import("@trpc/server").TRPCBuiltRouter<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                image: string;
            };
            output: void;
            meta: object;
        }>;
        getStories: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
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
            }[];
            meta: object;
        }>;
    }>>;
    users: import("@trpc/server").TRPCBuiltRouter<{
        ctx: object;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        follow: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
            };
            output: void;
            meta: object;
        }>;
        unfollow: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                userId: string;
            };
            output: void;
            meta: object;
        }>;
        getFollowers: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                userId: string;
            };
            output: {
                id: string;
                name: string;
                bio: string | null;
                website: string | null;
                image: string | null;
                followerCount: number;
                followingCount: number;
                postCount: number;
                isFollowing: boolean;
            }[];
            meta: object;
        }>;
        getFollowing: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                userId: string;
            };
            output: {
                id: string;
                name: string;
                bio: string | null;
                website: string | null;
                image: string | null;
                followerCount: number;
                followingCount: number;
                postCount: number;
                isFollowing: boolean;
            }[];
            meta: object;
        }>;
        getSuggestedUsers: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                name: string;
                bio: string | null;
                website: string | null;
                image: string | null;
                followerCount: number;
                followingCount: number;
                postCount: number;
                isFollowing: boolean;
            }[];
            meta: object;
        }>;
        updateProfile: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name?: string | undefined;
                bio?: string | undefined;
                website?: string | undefined;
            };
            output: void;
            meta: object;
        }>;
        getUserProfile: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                userId: string;
            };
            output: {
                id: string;
                name: string;
                bio: string | null;
                website: string | null;
                image: string | null;
                followerCount: number;
                followingCount: number;
                postCount: number;
                isFollowing: boolean;
            };
            meta: object;
        }>;
    }>>;
}>>;
export type AppRouter = typeof appRouter;
//# sourceMappingURL=server.d.ts.map