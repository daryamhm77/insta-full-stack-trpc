import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStorageProvider } from './local-storage.provider';
import { STORAGE_PROVIDER } from './storage.interface';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: STORAGE_PROVIDER,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const storageType = configService.get<string>('STORAGE_TYPE') ?? 'local';

        if (storageType === 'local') {
          return new LocalStorageProvider();
        }

        throw new Error(
          `Unsupported STORAGE_TYPE "${storageType}". Use "local" for now.`,
        );
      },
    },
  ],
  exports: [STORAGE_PROVIDER],
})
export class StorageModule {}
