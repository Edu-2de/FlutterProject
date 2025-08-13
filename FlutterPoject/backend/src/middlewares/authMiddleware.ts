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
    } catch (error) {
      throw {
        status: 403,
        message: messages.errors.INVALID_TOKEN,
        code: 'INVALID_TOKEN',
      };
    }
  };
  static requireAdmin(req: any, res: any, next: any) {
    console.log('⏳ Verifying....');
    console.log('Headers:', req.headers.authorization);

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
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      console.log('👨‍💼 User: ', decoded);

      if (decoded.role !== 'admin' && decoded.role !== 'manager') {
        console.log('❌ Role:', decoded.role);
        return res.status(403).json({ message: 'Admin access required' });
      }

      req.user = decoded;
      console.log('✅ Admin access accepted');
      next();
    } catch (error) {
      console.log('❌ Invalid Token:', error);
      return res.status(403).json({ message: 'Invalid token' });
    }
  }
}
