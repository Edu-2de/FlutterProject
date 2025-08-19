import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import { Request, Response, NextFunction } from 'express';
import { messages } from '../utils/messages';
import { AppError } from '../utils/appError';
import { isTokenBlacklisted } from '../utils/blacklist';

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || '';
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

const extractAndVerifyToken = async (req: AuthRequest): Promise<any> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new AppError(messages.errors.NO_TOKEN_PROVIDED, 401, 'NO_TOKEN_PROVIDED');
  }

  if (await isTokenBlacklisted(token)) {
    throw new AppError(messages.errors.INVALID_TOKEN, 403, 'INVALID_TOKEN');
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new AppError(messages.errors.INVALID_TOKEN, 403, 'INVALID_TOKEN');
  }
};

export class AuthMiddleware {
  static authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const decoded = await extractAndVerifyToken(req); 
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };

  static requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const decoded = await extractAndVerifyToken(req);

      if (decoded.role !== 'admin' && decoded.role !== 'manager') {
        logger.warn(`Unauthorized access attempt by user with role: ${decoded.role}`);
        res.status(403).json({ message: 'Admin access required' });
      }

      req.user = decoded;
      logger.info(`Admin access granted to user: ${decoded.email}`);
      next();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Token verification failed: ${errorMessage}`);
      next(error);
    }
  };
}
