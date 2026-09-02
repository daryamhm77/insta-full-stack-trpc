import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { S3StorageProvider } from './s3-storage.provider';

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({}),
  })),
  PutObjectCommand: jest.fn().mockImplementation((input) => input),
}));

describe('S3StorageProvider', () => {
  const baseOptions = {
    bucket: 'insta-photos',
    region: 'us-east-1',
    accessKeyId: 'key',
    secretAccessKey: 'secret',
  };

  it('builds a public AWS URL from bucket and region', () => {
    const storage = new S3StorageProvider(baseOptions);

    expect(storage.getUrl('cat.png')).toBe(
      'https://insta-photos.s3.us-east-1.amazonaws.com/images/cat.png',
    );
  });

  it('uses S3_PUBLIC_URL when provided', () => {
    const storage = new S3StorageProvider({
      ...baseOptions,
      publicBaseUrl: 'https://cdn.example.com/',
    });

    expect(storage.getUrl('cat.png')).toBe(
      'https://cdn.example.com/images/cat.png',
    );
  });

  it('requires a public URL when a custom endpoint is set', () => {
    expect(
      () =>
        new S3StorageProvider({
          ...baseOptions,
          endpoint: 'https://account.r2.cloudflarestorage.com',
        }),
    ).toThrow('S3_PUBLIC_URL');
  });

  it('uploads the file under the images/ prefix', async () => {
    const storage = new S3StorageProvider(baseOptions);
    const send = (S3Client as unknown as jest.Mock).mock.results.at(-1)
      ?.value.send;

    const url = await storage.upload(
      {
        buffer: Buffer.from('hello'),
        mimetype: 'image/png',
        originalname: 'cat.png',
      } as Express.Multer.File,
      'cat.png',
    );

    expect(PutObjectCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        Bucket: 'insta-photos',
        Key: 'images/cat.png',
        ContentType: 'image/png',
      }),
    );
    expect(send).toHaveBeenCalled();
    expect(url).toBe(
      'https://insta-photos.s3.us-east-1.amazonaws.com/images/cat.png',
    );
    expect(S3Client).toHaveBeenCalled();
  });
});
