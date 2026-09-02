"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const database_connection_1 = require("../db/database-connection");
const schema_1 = require("./schemas/schema");
let CommentsService = class CommentsService {
    database;
    constructor(database) {
        this.database = database;
    }
    async create(createCommentInput, userId) {
        await this.database.insert(schema_1.comment).values({
            userId,
            text: createCommentInput.text,
            postId: createCommentInput.postId,
            createdAt: new Date(),
        });
    }
    async findByPostId(postId) {
        const comments = await this.database.query.comment.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.comment.postId, postId),
            with: {
                user: true,
            },
        });
        return comments.map((item) => ({
            id: item.id,
            text: item.text,
            user: {
                username: item.user.name,
                id: item.user.id,
                avatar: item.user.image || '',
            },
            createdAt: item.createdAt.toISOString(),
        }));
    }
    async delete(commentId, userId) {
        await this.database
            .delete(schema_1.comment)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.comment.id, commentId), (0, drizzle_orm_1.eq)(schema_1.comment.userId, userId)));
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_connection_1.DATABASE_CONNECTION)),
    __metadata("design:paramtypes", [node_postgres_1.NodePgDatabase])
], CommentsService);
//# sourceMappingURL=comments.service.js.map