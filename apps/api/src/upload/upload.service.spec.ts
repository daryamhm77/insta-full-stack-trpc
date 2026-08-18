import { Test, TestingModule } from '@nestjs/testing';
import { STORAGE_PROVIDER } from './storage/storage.interface';
import { UploadService } from './upload.service';

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: STORAGE_PROVIDER,
          useValue: {
            upload: jest.fn().mockResolvedValue('/uploads/images/test.jpg'),
            getUrl: jest.fn().mockReturnValue('/uploads/images/test.jpg'),
          },
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
