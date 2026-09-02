"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTypeValidationPipe = exports.FileSizeValidationPipe = void 0;
const common_1 = require("@nestjs/common");
let FileSizeValidationPipe = class FileSizeValidationPipe {
    maxSize = 5 * 1024 * 1024;
    transform(value, _metadata) {
        if (!value) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (value.size > this.maxSize) {
            throw new common_1.BadRequestException(`File size exceeds the maximum limit of ${this.maxSize / (1024 * 1024)}MB`);
        }
        return value;
    }
};
exports.FileSizeValidationPipe = FileSizeValidationPipe;
exports.FileSizeValidationPipe = FileSizeValidationPipe = __decorate([
    (0, common_1.Injectable)()
], FileSizeValidationPipe);
let FileTypeValidationPipe = class FileTypeValidationPipe {
    allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
    ];
    transform(value, _metadata) {
        if (!value) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (!this.allowedTypes.includes(value.mimetype)) {
            throw new common_1.BadRequestException(`File type ${value.mimetype} is not allowed. Allowed types: ${this.allowedTypes.join(', ')}`);
        }
        return value;
    }
};
exports.FileTypeValidationPipe = FileTypeValidationPipe;
exports.FileTypeValidationPipe = FileTypeValidationPipe = __decorate([
    (0, common_1.Injectable)()
], FileTypeValidationPipe);
//# sourceMappingURL=file-validation.pipe.js.map