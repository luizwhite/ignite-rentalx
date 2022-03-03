import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { JsonWebTokenError } from 'jsonwebtoken';
import swaggerUI from 'swagger-ui-express';

import 'reflect-metadata';
import 'dotenv/config';
import '@shared/container';

import { AppError } from '@errors/AppError';
import { router } from '@routes';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

import swaggerFile from '../../../swagger.json';
import { rateLimiter } from './middlewares/rateLimiter';

const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN || '',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.use(rateLimiter);
app.use(cors());
app.use(router);

app.get('/debug-sentry', function mainHandler() {
  throw new Error('My Sentry error!');
});

app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(err) {
      const errStatusCode = err?.status || err?.statusCode || 500;

      if (errStatusCode === 429 || errStatusCode >= 500) return true;
      return false;
    },
  })
);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ error: err.name, message: err.message });
  }

  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({ error: err.name, message: err.message });
  }

  return res.status(500).json({
    error: err.name,
    message: `Internal server error - ${err.message}`,
  });
});

export { app };
