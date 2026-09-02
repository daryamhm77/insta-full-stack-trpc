"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyRelations = exports.story = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../auth/schema");
exports.story = (0, pg_core_1.pgTable)('story', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.text)('user_id')
        .notNull()
        .references(() => schema_1.user.id, { onDelete: 'cascade' }),
    image: (0, pg_core_1.text)('image').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at')
        .$defaultFn(() => new Date())
        .notNull(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at').notNull(),
});
exports.storyRelations = (0, drizzle_orm_1.relations)(exports.story, ({ one }) => ({
    user: one(schema_1.user, {
        fields: [exports.story.userId],
        references: [schema_1.user.id],
    }),
}));
//# sourceMappingURL=schema.js.map