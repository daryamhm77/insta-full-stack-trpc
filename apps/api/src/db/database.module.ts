import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DATABASE_CONNECTION } from './database-connection';
import * as schema from './schema';

export type Database = NodePgDatabase<typeof schema>;

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Database => {
        // Optional SSL for hosted Postgres (Neon, RDS, etc.).
        // Fotosnap's version loads an AWS RDS CA .pem in production —
        // only needed if your host requires a custom certificate authority.
        const useSsl = configService.get<string>('DATABASE_SSL') === 'true';
        const rejectUnauthorized =
          configService.get<string>('DATABASE_SSL_REJECT_UNAUTHORIZED') !==
          'false';

        const pool = new Pool({
          connectionString: configService.getOrThrow<string>('DATABASE_URL'),
          ssl: useSsl ? { rejectUnauthorized } : undefined,
        });

        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
