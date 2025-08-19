import { messages } from './messages';
import { UserService } from '../services/UserService';
import bcrypt from 'bcryptjs';

export class ValidationHelpers {
  // ========== Token & Authentication Validations ==========
  static validateUserFromToken(req: any): number {
    const userId = req.user?.id;
    if (!userId) {
      throw {
        status: 401,
        message: messages.errors.UNAUTHORIZED_ACCESS,
        code: 'UNAUTHORIZED_ACCESS',
      };
    }
    return userId;
  }

  static validateUserIdFromParams(req: any): number {
    const userId = Number(req.params.userId);
    if (!userId || isNaN(userId)) {
      throw {
        status: 400,
        message: messages.errors.INVALID_USER_ID,
        code: 'INVALID_USER_ID',
      };
    }
    return userId;
  }

  // ========== Database Validations ==========
  static async validateUserExists(userId: number) {
    const userProfile = await UserService.findUserById(userId);
    if (!userProfile) {
      throw {
        status: 404,
        message: messages.errors.USER_NOT_FOUND,
        code: 'USER_NOT_FOUND',
      };
    }
    return userProfile;
  }

  static async validateUsersExists() {
    const usersProfile = await UserService.getUsersProfile();
    if (!usersProfile) {
      throw {
        status: 404,
        message: messages.errors.USER_NOT_FOUND,
        code: 'USER_NOT_FOUND',
      };
    }
    return usersProfile;
  }

  static async validateEmailNotExists(email: string): Promise<void> {
    const userProfile = await UserService.findUserByEmail(email);
    if (userProfile) {
      throw {
        status: 409,
        message: messages.errors.EMAIL_ALREADY_EXISTS,
        code: 'EMAIL_ALREADY_EXISTS',
      };
    }
  }

  static async validateEmailExists(email: string) {
    const userProfile = await UserService.findUserByEmail(email);
    if (!userProfile) {
      throw {
        status: 404,
        message: messages.errors.USER_NOT_FOUND,
        code: 'USER_NOT_FOUND',
      };
    }
    return userProfile;
  }

  static async validatePhoneNotExists(phone: string): Promise<void> {
    const userProfile = await UserService.findUserByEmail(phone);
    if (userProfile) {
      throw {
        status: 409,
        message: messages.errors.PHONE_ALREADY_EXISTS,
        code: 'PHONE_ALREADY_EXISTS',
      };
    }
  }

  static async validateIfCorrectPassword(userId: number, password: string) {
    const userProfile = await UserService.findUserById(userId);

    const isPasswordCorrect = await bcrypt.compare(password, userProfile.password);
    if (!isPasswordCorrect) {
      throw {
        status: 401,
        message: messages.errors.INVALID_CREDENTIALS,
        code: 'INVALID_CREDENTIALS',
      };
    }
  }

  // ========== Schema Validations ==========
  static validateSchema(schema: any, data: any) {
    const { error } = schema.validate(data);
    if (error) {
      throw {
        status: 400,
        message: error.details[0].message,
        code: 'VALIDATION_ERROR',
      };
    }
  }

  // ========== Field Format Validations ==========
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  }

  // ========== Field Format Validations with Error Throwing ==========
  static validateEmailFormat(email: string): void {
    if (!this.isValidEmail(email)) {
      throw {
        status: 400,
        message: messages.errors.INVALID_EMAIL_FORMAT,
        code: 'INVALID_EMAIL_FORMAT',
      };
    }
  }

  static validatePasswordFormat(password: string): void {
    if (!this.isValidPassword(password)) {
      throw {
        status: 400,
        message: messages.errors.INVALID_PASSWORD_FORMAT,
        code: 'INVALID_PASSWORD_FORMAT',
      };
    }
  }
}
