import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { messages } from '../utils/messages';
import { registerSchema, loginSchema } from '../validators/authValidators';
import { User } from '../interfaces/UserInterfaces';
import logger from '../utils/logger';
import { UserService } from '../services/UserService';

const JWT_SECRET = process.env.JWT_SECRET || '';
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

export class AuthController {
  static register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error } = registerSchema.validate(req.body);
      if (error) {
        throw {
          status: 400,
          message: error.details[0].message,
          code: 'VALIDATION_ERROR',
        };
      }

      const { first_name, last_name = '', email, phone, password } = req.body;

      const checkEmail = await UserService.findUserByEmail(email);
      if (checkEmail) {
        throw {
          status: 409,
          message: messages.errors.EMAIL_ALREADY_EXISTS,
          code: 'EMAIL_ALREADY_EXISTS',
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await UserService.createUser(first_name, last_name, email, phone, hashedPassword);

      logger.info(`User registered successfully: ${email}`);

      res.status(201).json({
        success: true,
        message: messages.success.USER_REGISTERED,
        code: 'USER_REGISTERED',
        data: {
          userId: newUser.id,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  static login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error) {
        throw {
          status: 400,
          message: error.details[0].message,
          code: 'VALIDATION_ERROR',
        };
      }

      const { email, password } = req.body;

      const checkEmail = await UserService.findUserByEmail(email);
      if (!checkEmail) {
        throw {
          status: 401,
          message: messages.errors.INVALID_CREDENTIALS,
          code: 'INVALID_CREDENTIALS',
        };
      }

      const user: User = checkEmail.rows[0];

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        throw {
          status: 401,
          message: messages.errors.INVALID_CREDENTIALS,
          code: 'INVALID_CREDENTIALS',
        };
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '15m',
      });

      logger.info(`User logged in successfully: ${email}`);

      res.status(200).json({
        success: true,
        message: messages.success.LOGIN_SUCCESS,
        code: 'LOGIN_SUCCESS',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.first_name,
            role: user.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
