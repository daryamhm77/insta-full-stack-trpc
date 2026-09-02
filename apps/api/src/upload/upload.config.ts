import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';

export const generateFilename = (file: Express.Multer.File) => {
  const name = (file.originalname.split('.')[0] ?? 'file')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 40);
  const fileExtName = extname(file.originalname).toLowerCase();
  return `${name || 'file'}-${Date.now()}-${randomUUID()}${fileExtName}`;
};

const imageFileFilter = (
  _request: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return callback(
      new BadRequestException('Only image files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

/** Multer options: keep files in memory, allow images up to 5MB. */
export const multerConfig: MulterOptions = {
  storage: memoryStorage(),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};
