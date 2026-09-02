"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryStorageProvider = void 0;
const cloudinary_1 = require("cloudinary");
class CloudinaryStorageProvider {
    constructor(options) {
        cloudinary_1.v2.config({
            cloud_name: options.cloudName,
            api_key: options.apiKey,
            api_secret: options.apiSecret,
            secure: true,
        });
    }
    async upload(file, filename) {
        const publicId = filename.replace(/\.[^.]+$/, '');
        const result = await new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader
                .upload_stream({
                folder: 'images',
                public_id: publicId,
                resource_type: 'image',
                overwrite: false,
            }, (error, uploaded) => {
                if (error || !uploaded?.secure_url) {
                    reject(error ?? new Error('Cloudinary upload failed'));
                    return;
                }
                resolve({ secure_url: uploaded.secure_url });
            })
                .end(file.buffer);
        });
        return result.secure_url;
    }
    getUrl(filename) {
        return cloudinary_1.v2.url(`images/${filename}`, { secure: true });
    }
}
exports.CloudinaryStorageProvider = CloudinaryStorageProvider;
//# sourceMappingURL=cloudinary-storage.provider.js.map