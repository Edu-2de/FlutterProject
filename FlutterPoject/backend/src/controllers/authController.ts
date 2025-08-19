import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { messages } from '../utils/messages';
import { updateUserSchema, registerSchema, loginSchema } from '../validators/authValidators';
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
      ValidationHelpers.validateSchema(registerSchema, req.body);
      const { first_name, last_name = '', email, phone, password } = req.body;

      ValidationHelpers.isValidEmail(email);
      ValidationHelpers.isValidPassword(password);

      await ValidationHelpers.validateEmailNotExists(email);
      await ValidationHelpers.validatePhoneNotExists(phone);

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await UserService.createUser(first_name, last_name, email, phone, hashedPassword);

      logger.info(`User registered successfully: ${email}`);

      res.status(201).json({
        success: true,
        message: messages.success.USER_REGISTERED,
        code: 'USER_REGISTERED',
        data: { userId: newUser.id },
      });
    } catch (error) {
      next(error);
    }
  };

  static login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      ValidationHelpers.validateSchema(loginSchema, req.body);
      const { email, password } = req.body;
      const user = await ValidationHelpers.validateEmailExists(email);

      ValidationHelpers.validateIfCorrectPassword(user.id, password);

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
      const userId = ValidationHelpers.validateUserFromToken(req);
      const userProfile = await ValidationHelpers.validateUserExists(userId);

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
      const userId = ValidationHelpers.validateUserIdFromParams(req);
      const userProfile = await ValidationHelpers.validateUserExists(userId);

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
      const usersProfile = await ValidationHelpers.validateUsersExists();

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
      const userId = ValidationHelpers.validateUserFromToken(req);
      ValidationHelpers.validateSchema(updateUserSchema, req.body);
      await ValidationHelpers.validateUserExists(userId);

      const { first_name, last_name, email, phone, password, role } = req.body;

      await ValidationHelpers.validateUniqueFields(email, phone, userId);

      const updatedUser = await UserService.updateUser(userId, req.body);

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
      const userId = ValidationHelpers.validateUserIdFromParams(req);
      ValidationHelpers.validateSchema(updateUserSchema, req.body);
      await ValidationHelpers.validateUserExists(userId);

      const { first_name, last_name, email, phone, password, role } = req.body;

      await ValidationHelpers.validateUniqueFields(email, phone, userId);

      const updatedUser = await UserService.updateUser(userId, req.body);

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
      const userId = ValidationHelpers.validateUserFromToken(req);
      const userProfile = await ValidationHelpers.validateUserExists(userId);

      await UserService.deleteUserProfile(userId);

      res.status(200).json({
        success: true,
        message: messages.success.USER_DELETED,
        code: 'USER_DELETED',
        data: userProfile,
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteUserProfileById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = ValidationHelpers.validateUserIdFromParams(req);
      const userProfile = await ValidationHelpers.validateUserExists(userId);

      await UserService.deleteUserProfile(userId);

      res.status(200).json({
        success: true,
        message: messages.success.USER_DELETED,
        code: 'USER_DELETED',
        data: userProfile,
      });
    } catch (error) {
      next(error);
    }
  };
}
