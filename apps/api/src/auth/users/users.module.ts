import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/database.module';
import { UsersRouter } from './users.router';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, UsersRouter],
  exports: [UsersService],
})
export class UsersModule {}
