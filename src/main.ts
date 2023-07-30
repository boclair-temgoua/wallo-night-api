import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './app/config';
import helmet from 'helmet';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  // config.update({});
  const port = config.port;
  const version = config.api.version;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`/api/${version}`);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
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
