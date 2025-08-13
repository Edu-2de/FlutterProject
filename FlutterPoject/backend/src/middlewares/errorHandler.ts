import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'An unexpected error occurred';
  const code = err.code || 'SERVER_ERROR';

  res.status(status).json({
    success: false,
    message,
    code,
  });
};