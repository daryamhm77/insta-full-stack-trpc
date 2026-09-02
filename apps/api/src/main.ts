import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RequestMethod } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { parseOrigins } from './config/origins';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false, // required so Better Auth can read the raw request body
  });

  const configService = app.get(ConfigService);
  const webOrigins = parseOrigins(
    configService.get<string>('WEB_URL') ?? 'http://localhost:3000',
  );

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  app.enableCors({
    origin: webOrigins,
    credentials: true,
  });
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });
  await app.listen(configService.get<number>('PORT') ?? 3001);
}
bootstrap();
