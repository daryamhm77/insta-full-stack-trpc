import { type StorageProvider } from './storage/storage.interface';
export declare class UploadService {
    private readonly storageProvider;
    constructor(storageProvider: StorageProvider);
    uploadImage(file: Express.Multer.File): Promise<{
        filename: string;
        url: string;
    }>;
}
