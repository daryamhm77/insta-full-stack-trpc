"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerConfig = exports.generateFilename = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const path_1 = require("path");
const crypto_1 = require("crypto");
const generateFilename = (file) => {
    const name = (file.originalname.split('.')[0] ?? 'file')
        .replace(/[^a-zA-Z0-9_-]/g, '')
        .slice(0, 40);
    const fileExtName = (0, path_1.extname)(file.originalname).toLowerCase();
    return `${name || 'file'}-${Date.now()}-${(0, crypto_1.randomUUID)()}${fileExtName}`;
};
exports.generateFilename = generateFilename;
const imageFileFilter = (_request, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return callback(new common_1.BadRequestException('Only image files are allowed!'), false);
    }
    callback(null, true);
};
exports.multerConfig = {
    storage: (0, multer_1.memoryStorage)(),
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
};
//# sourceMappingURL=upload.config.js.map