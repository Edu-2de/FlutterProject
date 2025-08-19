import { messages } from './messages';
import { UserService } from '../services/UserService';

export class ValidationHelpers {
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
}