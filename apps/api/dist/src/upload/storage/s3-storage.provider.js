"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3StorageProvider = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
class S3StorageProvider {
    client;
    bucket;
    publicBaseUrl;
    keyPrefix;
    constructor(options) {
        if (options.endpoint && !options.publicBaseUrl) {
            throw new Error('S3_PUBLIC_URL is required when S3_ENDPOINT is set (Cloudflare R2, MinIO, etc.).');
        }
        this.bucket = options.bucket;
        this.keyPrefix = (options.keyPrefix ?? 'images').replace(/^\/|\/$/g, '');
        this.client = new client_s3_1.S3Client({
            region: options.region,
            credentials: {
                accessKeyId: options.accessKeyId,
                secretAccessKey: options.secretAccessKey,
            },
            ...(options.endpoint ? { endpoint: options.endpoint } : {}),
            forcePathStyle: options.forcePathStyle ?? Boolean(options.endpoint),
        });
        this.publicBaseUrl = (options.publicBaseUrl ??
            `https://${options.bucket}.s3.${options.region}.amazonaws.com`).replace(/\/$/, '');
    }
    async upload(file, filename) {
        const key = `${this.keyPrefix}/${filename}`;
        await this.client.send(new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            CacheControl: 'public, max-age=31536000, immutable',
        }));
        return this.getUrl(filename);
    }
    getUrl(filename) {
        return `${this.publicBaseUrl}/${this.keyPrefix}/${filename}`;
    }
}
exports.S3StorageProvider = S3StorageProvider;
//# sourceMappingURL=s3-storage.provider.js.map