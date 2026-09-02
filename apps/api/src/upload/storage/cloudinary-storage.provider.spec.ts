import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorageProvider } from './cloudinary-storage.provider';

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    url: jest.fn(
      (id: string) => `https://res.cloudinary.com/demo/image/upload/${id}`,
    ),
    uploader: {
      upload_stream: jest.fn(),
    },
  },
}));

describe('CloudinaryStorageProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
      (_options, callback) => ({
        end: () => {
          callback(null, {
            secure_url:
              'https://res.cloudinary.com/demo/image/upload/images/cat.png',
          });
        },
      }),
    );
  });

  it('uploads a buffer and returns the secure URL', async () => {
    const storage = new CloudinaryStorageProvider({
      cloudName: 'demo',
      apiKey: 'key',
      apiSecret: 'secret',
    });

    const url = await storage.upload(
      {
        buffer: Buffer.from('hello'),
        mimetype: 'image/png',
        originalname: 'cat.png',
      } as Express.Multer.File,
      'cat.png',
    );

    expect(cloudinary.config).toHaveBeenCalledWith(
      expect.objectContaining({ cloud_name: 'demo', secure: true }),
    );
    expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
      expect.objectContaining({
        folder: 'images',
        public_id: 'cat',
        resource_type: 'image',
      }),
      expect.any(Function),
    );
    expect(url).toBe(
      'https://res.cloudinary.com/demo/image/upload/images/cat.png',
    );
  });

  it('rejects when Cloudinary returns an error', async () => {
    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
      (_options, callback) => ({
        end: () => callback(new Error('quota exceeded')),
      }),
    );

    const storage = new CloudinaryStorageProvider({
      cloudName: 'demo',
      apiKey: 'key',
      apiSecret: 'secret',
    });

    await expect(
      storage.upload(
        {
          buffer: Buffer.from('hello'),
          mimetype: 'image/png',
          originalname: 'cat.png',
        } as Express.Multer.File,
        'cat.png',
      ),
    ).rejects.toThrow('quota exceeded');
  });
});
