import 'dotenv/config';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import compression from 'fastify-compress';
import helmet from 'fastify-helmet';
import { AppModule } from './modules';

async function bootstrapApp(): Promise<void> {
  const isProd = process.env.NODE_ENV === 'prod';
  const isAcc = process.env.NODE_ENV === 'acc';

  // create nest app
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // set global prefix
  // note this prefix is dependend on
  // the API gateway prefix
  app.setGlobalPrefix('api/company/v1');

  // validate incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: isProd,
    }),
  );

  // on acc we need the app to be exactly the
  // same as the production app, with the
  // exception of the ratelimiter, for load
  // test purposes
  if (isAcc || isProd) {
    // enable system hooks for health checking
    app.enableShutdownHooks();

    app.enableCors();

    app.use(helmet, {});

    // compress
    app.use(compression, { encodings: ['gzip', 'deflate'] });
  }

  // listen on port 3000
  await app.listen(3000, '0.0.0.0');
}

void bootstrapApp();
