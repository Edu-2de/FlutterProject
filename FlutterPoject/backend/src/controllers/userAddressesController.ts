import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { messages } from '../utils/messages';
import { UserService } from '../services/UserService';

const JWT_SECRET = process.env.JWT_SECRET || '';
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

export class userAddressesController {
  static addAddress = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw {
          status: 401,
          message: messages.errors.UNAUTHORIZED_ACCESS,
          code: 'UNAUTHORIZED_ACCESS',
        };
      }

      const userProfile = await UserService.findUserById(userId);

      if (!userProfile) {
        throw {
          status: 404,
          message: messages.errors.USER_NOT_FOUND,
          code: 'USER_NOT_FOUND',
        };
      }
    } catch (error) {
      next(error);
    }
  };
}
