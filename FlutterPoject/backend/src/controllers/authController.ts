import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { messages } from '../utils/messages';
import { updateUserSchema, registerSchema, loginSchema } from '../validators/authValidators';
import { User } from '../interfaces/UserInterfaces';
import logger from '../utils/logger';
import { UserService } from '../services/UserService';
import { ValidationHelpers } from '../utils/validationHelpers';

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

      ValidationHelpers.isValidEmail(email)
      ValidationHelpers.isValidPassword(password)

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

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
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

  static getUserProfile = async (req: any, res: Response, next: NextFunction): Promise<void> => {
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

      res.status(200).json({
        success: true,
        message: messages.success.PROFILE_FETCHED,
        code: 'PROFILE_FETCHED',
        data: userProfile,
      });
    } catch (error) {
      next(error);
    }
  };

  static getUserProfileById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.userId);

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

      res.status(200).json({
        success: true,
        message: messages.success.PROFILE_FETCHED,
        code: 'PROFILE_FETCHED',
        data: userProfile,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllUsersProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const usersProfile = await UserService.getUsersProfile();

      if (!usersProfile) {
        throw {
          status: 404,
          message: messages.errors.USERS_NOT_FOUND,
          code: 'USERS_NOT_FOUND',
        };
      }

      res.status(200).json({
        success: true,
        message: messages.success.PROFILES_FETCHED,
        code: 'PROFILES_FETCHED',
        data: usersProfile,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateUserProfile = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw {
          status: 401,
          message: messages.errors.UNAUTHORIZED_ACCESS,
          code: 'UNAUTHORIZED_ACCESS',
        };
      }

      const { error, value } = updateUserSchema.validate(req.body);
      if (error) {
        throw {
          status: 400,
          message: error.details[0].message,
          code: 'VALIDATION_ERROR',
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

      const uniqueFieldErrors = await UserService.validateUniqueFields(value.email, value.phone, userId);

      if (uniqueFieldErrors.length > 0) {
        const firstError = uniqueFieldErrors[0];
        throw {
          status: 409,
          message: messages.errors[firstError.code as keyof typeof messages.errors],
          code: firstError.code,
        };
      }

      const updatedUser = await UserService.updateUser(userId, value);

      logger.info(`User profile updated successfully: ${updatedUser.email}`);

      res.status(200).json({
        success: true,
        message: messages.success.USER_UPDATED,
        code: 'USER_UPDATED',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateUserProfileById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.userId);

      if (!userId) {
        throw {
          status: 400,
          message: messages.errors.INVALID_USER_ID,
          code: 'INVALID_USER_ID',
        };
      }

      const { error, value } = updateUserSchema.validate(req.body);
      if (error) {
        throw {
          status: 400,
          message: error.details[0].message,
          code: 'VALIDATION_ERROR',
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

      const uniqueFieldErrors = await UserService.validateUniqueFields(value.email, value.phone, userId);

      if (uniqueFieldErrors.length > 0) {
        const firstError = uniqueFieldErrors[0];
        throw {
          status: 409,
          message: messages.errors[firstError.code as keyof typeof messages.errors],
          code: firstError.code,
        };
      }

      const updatedUser = await UserService.updateUser(userId, value);

      logger.info(`User profile updated by admin: ${updatedUser.email}`);

      res.status(200).json({
        success: true,
        message: messages.success.USER_UPDATED,
        code: 'USER_UPDATED',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteUserProfile = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw {
          status: 401,
          message: messages.errors.UNAUTHORIZED_ACCESS,
          code: 'UNAUTHORIZED_ACCESS',
        };
      }

      const userProfile = UserService.findUserById(userId);

      if (!userProfile) {
        throw {
          status: 404,
          message: messages.errors.USER_NOT_FOUND,
          code: 'USER_NOT_FOUND',
        };
      }

      UserService.deleteUserProfile(userId);

      res.json({
        message: messages.success.USER_DELETED,
        code: 'USER_DELETED',
        user: userProfile,
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteUserProfileById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.userId);

      if (!userId) {
        throw {
          status: 401,
          message: messages.errors.UNAUTHORIZED_ACCESS,
          code: 'UNAUTHORIZED_ACCESS',
        };
      }

      const userProfile = UserService.findUserById(userId);

      if (!userProfile) {
        throw {
          status: 404,
          message: messages.errors.USER_NOT_FOUND,
          code: 'USER_NOT_FOUND',
        };
      }

      UserService.deleteUserProfile(userId);

      res.json({
        message: messages.success.USER_DELETED,
        code: 'USER_DELETED',
        user: userProfile,
      });
    } catch (error) {
      next(error);
    }
  };
}
