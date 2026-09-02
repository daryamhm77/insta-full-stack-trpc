import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class FileSizeValidationPipe implements PipeTransform {
    private readonly maxSize;
    transform(value: Express.Multer.File, _metadata: ArgumentMetadata): Express.Multer.File;
}
export declare class FileTypeValidationPipe implements PipeTransform {
    private readonly allowedTypes;
    transform(value: Express.Multer.File, _metadata: ArgumentMetadata): Express.Multer.File;
}
