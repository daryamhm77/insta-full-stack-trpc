"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const storage_interface_1 = require("./storage/storage.interface");
const upload_config_1 = require("./upload.config");
let UploadService = class UploadService {
    storageProvider;
    constructor(storageProvider) {
        this.storageProvider = storageProvider;
    }
    async uploadImage(file) {
        const filename = (0, upload_config_1.generateFilename)(file);
        const url = await this.storageProvider.upload(file, filename);
        return { filename, url };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(storage_interface_1.STORAGE_PROVIDER)),
    __metadata("design:paramtypes", [Object])
], UploadService);
//# sourceMappingURL=upload.service.js.map