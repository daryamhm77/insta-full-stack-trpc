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
export declare class S3StorageProvider implements StorageProvider {
    private readonly client;
    private readonly bucket;
    private readonly publicBaseUrl;
    private readonly keyPrefix;
    constructor(options: S3StorageOptions);
    upload(file: Express.Multer.File, filename: string): Promise<string>;
    getUrl(filename: string): string;
}
