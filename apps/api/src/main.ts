import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false, // required so Better Auth can read the raw request body
  });

  const configService = app.get(ConfigService);

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  app.enableCors({
    origin: configService.get<string>('WEB_URL') ?? 'http://localhost:3000',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  await app.listen(configService.get<number>('PORT') ?? 3001);
}
bootstrap();
