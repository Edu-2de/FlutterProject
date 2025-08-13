import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { messages } from '../utils/messages';

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

const extractAndVerifyToken = (req: AuthRequest): any => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw {
      status: 401,
      message: messages.errors.NO_TOKEN_PROVIDED,
      code: 'NO_TOKEN_PROVIDED',
    };
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw {
      status: 403,
      message: messages.errors.INVALID_TOKEN,
      code: 'INVALID_TOKEN',
    };
  }
};

export class AuthMiddleware {
  static authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const decoded = extractAndVerifyToken(req);
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };

  static requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const decoded = extractAndVerifyToken(req);

      if (decoded.role !== 'admin' && decoded.role !== 'manager') {
        res.status(403).json({ message: 'Admin access required' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
}
