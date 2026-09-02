"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savedPostRelations = exports.savedPost = exports.likeRelations = exports.like = exports.postRelations = exports.post = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../auth/schema");
const schema_2 = require("../../comments/schemas/schema");
exports.post = (0, pg_core_1.pgTable)('post', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    image: (0, pg_core_1.text)('image').notNull(),
    caption: (0, pg_core_1.text)('caption').notNull(),
    createdAt: (0, pg_core_1.timestamp)('createdAt').notNull(),
    userId: (0, pg_core_1.text)('user_id')
        .notNull()
        .references(() => schema_1.user.id),
});
exports.postRelations = (0, drizzle_orm_1.relations)(exports.post, ({ one, many }) => ({
    user: one(schema_1.user, {
        fields: [exports.post.userId],
        references: [schema_1.user.id],
    }),
    likes: many(exports.like),
    comments: many(schema_2.comment),
    savedBy: many(exports.savedPost),
}));
exports.like = (0, pg_core_1.pgTable)('like', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.text)('user_id')
        .notNull()
        .references(() => schema_1.user.id),
    postId: (0, pg_core_1.integer)('post_id')
        .notNull()
        .references(() => exports.post.id),
});
exports.likeRelations = (0, drizzle_orm_1.relations)(exports.like, ({ one }) => ({
    user: one(schema_1.user, {
        fields: [exports.like.userId],
        references: [schema_1.user.id],
    }),
    post: one(exports.post, {
        fields: [exports.like.postId],
        references: [exports.post.id],
    }),
}));
exports.savedPost = (0, pg_core_1.pgTable)('saved_post', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.text)('user_id')
        .notNull()
        .references(() => schema_1.user.id, { onDelete: 'cascade' }),
    postId: (0, pg_core_1.integer)('post_id')
        .notNull()
        .references(() => exports.post.id, { onDelete: 'cascade' }),
    createdAt: (0, pg_core_1.timestamp)('created_at')
        .$defaultFn(() => new Date())
        .notNull(),
});
exports.savedPostRelations = (0, drizzle_orm_1.relations)(exports.savedPost, ({ one }) => ({
    user: one(schema_1.user, {
        fields: [exports.savedPost.userId],
        references: [schema_1.user.id],
    }),
    post: one(exports.post, {
        fields: [exports.savedPost.postId],
        references: [exports.post.id],
    }),
}));
//# sourceMappingURL=schema.js.map