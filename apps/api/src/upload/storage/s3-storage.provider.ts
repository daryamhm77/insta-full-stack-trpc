import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { StorageProvider } from './storage.interface';

export type S3StorageOptions = {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint?: string;
  publicBaseUrl?: string;
  forcePathStyle?: boolean;
  keyPrefix?: string;
};

export class S3StorageProvider implements StorageProvider {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;
  private readonly keyPrefix: string;

  constructor(options: S3StorageOptions) {
    if (options.endpoint && !options.publicBaseUrl) {
      throw new Error(
        'S3_PUBLIC_URL is required when S3_ENDPOINT is set (Cloudflare R2, MinIO, etc.).',
      );
    }

    this.bucket = options.bucket;
    this.keyPrefix = (options.keyPrefix ?? 'images').replace(/^\/|\/$/g, '');
    this.client = new S3Client({
      region: options.region,
      credentials: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
      },
      ...(options.endpoint ? { endpoint: options.endpoint } : {}),
      forcePathStyle:
        options.forcePathStyle ?? Boolean(options.endpoint),
    });

    this.publicBaseUrl = (
      options.publicBaseUrl ??
      `https://${options.bucket}.s3.${options.region}.amazonaws.com`
    ).replace(/\/$/, '');
  }

  async upload(file: Express.Multer.File, filename: string): Promise<string> {
    const key = `${this.keyPrefix}/${filename}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );

    return this.getUrl(filename);
  }

  getUrl(filename: string): string {
    return `${this.publicBaseUrl}/${this.keyPrefix}/${filename}`;
  }
}
