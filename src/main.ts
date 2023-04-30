import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configurations } from './app/configurations';
import helmet from 'helmet';
import * as path from 'path';

async function bootstrap() {
  // config.update({});
  const port = configurations.port;
  const version = configurations.api.version;
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix(`/api/${version}`);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(helmet());
  app.enableCors();
  // app.use(useragent.express());
  await app.listen(port, () => {
    console.log(`=============================================`);
    console.log(`*** 🚀 Link  http://localhost:${port}/api/${version} ***`);
    console.log(`=============================================`);
  });
}
bootstrap();
