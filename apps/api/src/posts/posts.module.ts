import { Module } from '@nestjs/common';
import { UsersModule } from '../auth/users/users.module';
import { DatabaseModule } from '../db/database.module';
import { PostsRouter } from './posts.router';
import { PostsService } from './posts.service';

@Module({
  imports: [DatabaseModule, UsersModule],
  providers: [PostsService, PostsRouter],
})
export class PostsModule {}
