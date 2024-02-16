import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { config } from './app/config';

async function bootstrap() {
  // config.update({});
  const port = config.port;
  const version = config.api.version;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix(`/api/${version}`);
  const whitelist = config.url.allowedOrigins?.split(',') || [
    'http://localhost:3000',
  ];
  app.enableCors({
    origin: whitelist,
    credentials: true,
  });
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      //transform: true,
    }),
  );
  app.use(helmet());
  // app.use(useragent.express());

  await app.listen(port, () => {
    console.log(`=============================================`);
    console.log(`*** 🚀 Link  http://localhost:${port}/api/${version} ***`);
    console.log(`=============================================`);
  });
}
bootstrap();
