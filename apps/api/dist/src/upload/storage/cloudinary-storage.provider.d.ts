import type { StorageProvider } from './storage.interface';
export type CloudinaryStorageOptions = {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
};
export declare class CloudinaryStorageProvider implements StorageProvider {
    constructor(options: CloudinaryStorageOptions);
    upload(file: Express.Multer.File, filename: string): Promise<string>;
    getUrl(filename: string): string;
}
