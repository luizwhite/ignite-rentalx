import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { JsonWebTokenError } from 'jsonwebtoken';
import swaggerUI from 'swagger-ui-express';

import 'reflect-metadata';
import '@shared/container';

import { AppError } from '@errors/AppError';
import { router } from '@routes';

import swaggerFile from '../../../swagger.json';

const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.use(router);

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
