import { Inject } from '@nestjs/common';
import {
  Router,
  Query,
  Mutation,
  Input,
  Ctx,
  UseMiddlewares,
} from 'nestjs-trpc';
import { z } from 'zod';
import { AuthTrpcMiddleware } from '../auth-trpc.middleware';
import type { AppContext } from '../../app-context.interface';
import { UsersService } from './users.service';
import {
  searchUsersSchema,
  updateProfileSchema,
  userIdSchema,
  userProfileSchema,
} from '@repo/trpc/schemas';
import type {
  SearchUsersInput,
  UpdateProfileInput,
  UserIdInput,
} from '@repo/trpc/schemas';

@Router({ alias: 'users' })
@UseMiddlewares(AuthTrpcMiddleware)
export class UsersRouter {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  @Mutation({ input: userIdSchema })
  follow(@Input() input: UserIdInput, @Ctx() context: AppContext) {
    return this.usersService.follow(context.user.id, input.userId);
  }

  @Mutation({ input: userIdSchema })
  unfollow(@Input() input: UserIdInput, @Ctx() context: AppContext) {
    return this.usersService.unfollow(context.user.id, input.userId);
  }

  @Query({ input: userIdSchema, output: z.array(userProfileSchema) })
  getFollowers(@Input() input: UserIdInput, @Ctx() context: AppContext) {
    return this.usersService.getFollowers(input.userId, context.user.id);
  }

  @Query({ input: userIdSchema, output: z.array(userProfileSchema) })
  getFollowing(@Input() input: UserIdInput, @Ctx() context: AppContext) {
    return this.usersService.getFollowing(input.userId, context.user.id);
  }

  @Query({ output: z.array(userProfileSchema) })
  getSuggestedUsers(@Ctx() context: AppContext) {
    return this.usersService.getSuggestedUsers(context.user.id);
  }

  @Query({ input: searchUsersSchema, output: z.array(userProfileSchema) })
  searchUsers(@Input() input: SearchUsersInput, @Ctx() context: AppContext) {
    return this.usersService.searchUsers(input.query, context.user.id);
  }

  @Mutation({ input: updateProfileSchema })
  updateProfile(
    @Input() input: UpdateProfileInput,
    @Ctx() context: AppContext,
  ) {
    return this.usersService.updateProfile(context.user.id, input);
  }

  @Query({ input: userIdSchema, output: userProfileSchema })
  getUserProfile(
    @Input() input: UserIdInput,
    @Ctx() context: AppContext,
  ) {
    return this.usersService.getUserProfile(input.userId, context.user.id);
  }
}
