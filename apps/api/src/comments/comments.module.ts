import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { CommentsRouter } from './comments.router';
import { CommentsService } from './comments.service';

@Module({
  imports: [DatabaseModule],
  providers: [CommentsService, CommentsRouter],
})
export class CommentsModule {}
