import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
// import * as Sentry from '@sentry/node';
// import { nodeProfilingIntegration } from '@sentry/profiling-node';
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
    exposedHeaders: ['set-cookie'],
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

  // Sentry.init({
  //   dsn: '',
  //   integrations: [
  //     // enable HTTP calls tracing
  //     new Sentry.Integrations.Http({ tracing: true }),
  //     // enable Express.js middleware tracing
  //     nodeProfilingIntegration(),
  //   ],
  //   // Performance Monitoring
  //   tracesSampleRate: config.environment === 'prod' ? 0.1 : 1, // Capture 100% of the transactions, reduce in production!
  //   // Set sampling rate for profiling - this is relative to tracesSampleRate
  //   profilesSampleRate: config.environment === 'prod' ? 0.1 : 1, // Capture 100% of the transactions, reduce in production!

  //   // Disable transport in development, transaction are still captured in debug mode
  //   enabled: config.environment !== 'local',
  //   enableTracing: config.environment !== 'local',

  //   environment: config.environment,
  //   serverName: config.url.serverUrl,
  // });
  await app.listen(port, () => {
    console.log(`=============================================`);
    console.log(`*** 🚀 Link  http://localhost:${port}/api/${version} ***`);
    console.log(`=============================================`);
  });
}
bootstrap();
