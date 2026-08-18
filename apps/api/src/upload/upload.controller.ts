import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import {
  FileSizeValidationPipe,
  FileTypeValidationPipe,
} from './file-validation.pipe';
import { multerConfig } from './upload.config';
import { UploadService } from './upload.service';

@AllowAnonymous()
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async uploadFile(
    @UploadedFile(new FileSizeValidationPipe(), new FileTypeValidationPipe())
    file: Express.Multer.File,
  ) {
    return this.uploadService.uploadImage(file);
  }
}
