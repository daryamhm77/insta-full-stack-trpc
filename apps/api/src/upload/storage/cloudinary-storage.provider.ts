import { v2 as cloudinary } from 'cloudinary';
import type { StorageProvider } from './storage.interface';

export type CloudinaryStorageOptions = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

export class CloudinaryStorageProvider implements StorageProvider {
  constructor(options: CloudinaryStorageOptions) {
    cloudinary.config({
      cloud_name: options.cloudName,
      api_key: options.apiKey,
      api_secret: options.apiSecret,
      secure: true,
    });
  }

  async upload(file: Express.Multer.File, filename: string): Promise<string> {
    const publicId = filename.replace(/\.[^.]+$/, '');

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'images',
            public_id: publicId,
            resource_type: 'image',
            overwrite: false,
          },
          (error, uploaded) => {
            if (error || !uploaded?.secure_url) {
              reject(error ?? new Error('Cloudinary upload failed'));
              return;
            }
            resolve({ secure_url: uploaded.secure_url });
          },
        )
        .end(file.buffer);
    });

    return result.secure_url;
  }

  getUrl(filename: string): string {
    return cloudinary.url(`images/${filename}`, { secure: true });
  }
}
