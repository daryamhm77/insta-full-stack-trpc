"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_storage_provider_1 = require("./cloudinary-storage.provider");
const local_storage_provider_1 = require("./local-storage.provider");
const s3_storage_provider_1 = require("./s3-storage.provider");
const storage_interface_1 = require("./storage.interface");
let StorageModule = class StorageModule {
};
exports.StorageModule = StorageModule;
exports.StorageModule = StorageModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [
            {
                provide: storage_interface_1.STORAGE_PROVIDER,
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const storageType = configService.get('STORAGE_TYPE') ?? 'local';
                    if (storageType === 'local') {
                        return new local_storage_provider_1.LocalStorageProvider();
                    }
                    if (storageType === 'cloudinary') {
                        return new cloudinary_storage_provider_1.CloudinaryStorageProvider({
                            cloudName: configService.getOrThrow('CLOUDINARY_CLOUD_NAME'),
                            apiKey: configService.getOrThrow('CLOUDINARY_API_KEY'),
                            apiSecret: configService.getOrThrow('CLOUDINARY_API_SECRET'),
                        });
                    }
                    if (storageType === 's3') {
                        return new s3_storage_provider_1.S3StorageProvider({
                            bucket: configService.getOrThrow('S3_BUCKET'),
                            region: configService.get('S3_REGION') ?? 'us-east-1',
                            accessKeyId: configService.getOrThrow('S3_ACCESS_KEY_ID'),
                            secretAccessKey: configService.getOrThrow('S3_SECRET_ACCESS_KEY'),
                            endpoint: configService.get('S3_ENDPOINT') || undefined,
                            publicBaseUrl: configService.get('S3_PUBLIC_URL') || undefined,
                            forcePathStyle: configService.get('S3_FORCE_PATH_STYLE') === 'true',
                        });
                    }
                    throw new Error(`Unsupported STORAGE_TYPE "${storageType}". Use "local", "cloudinary", or "s3".`);
                },
            },
        ],
        exports: [storage_interface_1.STORAGE_PROVIDER],
    })
], StorageModule);
//# sourceMappingURL=storage.module.js.map