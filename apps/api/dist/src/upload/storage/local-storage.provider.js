"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageProvider = void 0;
const promises_1 = require("fs/promises");
const path_1 = require("path");
class LocalStorageProvider {
    uploadDir = './uploads/images';
    async upload(file, filename) {
        await (0, promises_1.mkdir)(this.uploadDir, { recursive: true });
        const filePath = (0, path_1.join)(this.uploadDir, filename);
        await (0, promises_1.writeFile)(filePath, file.buffer);
        return this.getUrl(filename);
    }
    getUrl(filename) {
        return `/uploads/images/${filename}`;
    }
}
exports.LocalStorageProvider = LocalStorageProvider;
//# sourceMappingURL=local-storage.provider.js.map