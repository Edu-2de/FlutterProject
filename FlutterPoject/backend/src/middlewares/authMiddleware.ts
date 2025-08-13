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

export class AuthMiddleware {
  static authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw {
        status: 401,
        message: messages.errors.NO_TOKEN_PROVIDED,
        code: 'NO_TOKEN_PROVIDED',
      };
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = decoded;
      next();
    }catch(error){
      
    }
  };
}
