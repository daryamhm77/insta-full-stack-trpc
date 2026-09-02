import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStorageProvider } from './local-storage.provider';
import { S3StorageProvider } from './s3-storage.provider';
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

        if (storageType === 's3') {
          return new S3StorageProvider({
            bucket: configService.getOrThrow<string>('S3_BUCKET'),
            region: configService.get<string>('S3_REGION') ?? 'us-east-1',
            accessKeyId: configService.getOrThrow<string>('S3_ACCESS_KEY_ID'),
            secretAccessKey: configService.getOrThrow<string>(
              'S3_SECRET_ACCESS_KEY',
            ),
            endpoint: configService.get<string>('S3_ENDPOINT') || undefined,
            publicBaseUrl:
              configService.get<string>('S3_PUBLIC_URL') || undefined,
            forcePathStyle:
              configService.get<string>('S3_FORCE_PATH_STYLE') === 'true',
          });
        }

        throw new Error(
          `Unsupported STORAGE_TYPE "${storageType}". Use "local" or "s3".`,
        );
      },
    },
  ],
  exports: [STORAGE_PROVIDER],
})
export class StorageModule {}
