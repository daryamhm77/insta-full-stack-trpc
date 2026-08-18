import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppContext } from './app.context';
import { AuthTrpcMiddleware } from './auth/auth-trpc.middleware';
import { createAuth } from './auth/create-auth';
import { DATABASE_CONNECTION } from './db/database-connection';
import { DatabaseModule } from './db/database.module';
import { PostsModule } from './posts/posts.module';
import * as schema from './db/schema';
import { TRPCModule } from 'nestjs-trpc';
import { UsersModule } from './auth/users/users.module';
import { UploadModule } from './upload/upload.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    TRPCModule.forRoot({
      basePath: '/api/trpc',
      context: AppContext,
    }),
    AuthModule.forRootAsync({
      imports: [DatabaseModule, ConfigModule],
      inject: [DATABASE_CONNECTION, ConfigService],
      useFactory: (
        database: NodePgDatabase<typeof schema>,
        configService: ConfigService,
      ) => {
        const webUrl = configService.get<string>('WEB_URL');

        return {
          auth: createAuth(database, {
            baseURL: configService.getOrThrow<string>('BETTER_AUTH_URL'),
            secret: configService.getOrThrow<string>('BETTER_AUTH_SECRET'),
            trustedOrigins: webUrl ? [webUrl] : undefined,
          }),
        };
      },
    }),
    PostsModule,
    UsersModule,
    UploadModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppContext, AuthTrpcMiddleware],
})
export class AppModule {}
