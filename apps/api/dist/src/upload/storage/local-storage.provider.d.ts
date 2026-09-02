import type { StorageProvider } from './storage.interface';
export declare class LocalStorageProvider implements StorageProvider {
    private readonly uploadDir;
    upload(file: Express.Multer.File, filename: string): Promise<string>;
    getUrl(filename: string): string;
}
