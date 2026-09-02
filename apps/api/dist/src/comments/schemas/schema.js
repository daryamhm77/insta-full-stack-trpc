"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRelations = exports.comment = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../auth/schema");
const schema_2 = require("../../posts/schemas/schema");
exports.comment = (0, pg_core_1.pgTable)('comment', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    text: (0, pg_core_1.text)('text').notNull(),
    userId: (0, pg_core_1.text)('user_id')
        .notNull()
        .references(() => schema_1.user.id),
    postId: (0, pg_core_1.integer)('post_id')
        .notNull()
        .references(() => schema_2.post.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull(),
});
exports.commentRelations = (0, drizzle_orm_1.relations)(exports.comment, ({ one }) => ({
    user: one(schema_1.user, {
        fields: [exports.comment.userId],
        references: [schema_1.user.id],
    }),
    post: one(schema_2.post, {
        fields: [exports.comment.postId],
        references: [schema_2.post.id],
    }),
}));
//# sourceMappingURL=schema.js.map