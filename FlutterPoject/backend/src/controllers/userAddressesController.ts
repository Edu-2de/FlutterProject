import { Request, Response, NextFunction } from 'express';
import { messages } from '../utils/messages';
import { UserService } from '../services/UserService';
import { UserAddressesService } from '../services/UserAddressesService';
import { userAddressesSchema } from '../validators/userAddressesValidators';
import logger from '../utils/logger';

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

      const { error } = userAddressesSchema.validate(req.body);
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

      const { address_type, street_address, city, state, postal_code, country } = req.body;

      const addAddress = await UserAddressesService.addAddress(
        userId,
        address_type,
        street_address,
        city,
        state,
        postal_code,
        country
      );

      logger.info(`Address added successfully for user: ${userProfile.email}`);

      res.status(201).json({
        success: true,
        message: 'Address added successfully',
        code: 'ADDRESS_ADDED',
        data: addAddress,
      });
    } catch (error) {
      next(error);
    }
  };
  static addAddressByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.userId);
      if (!userId) {
        throw {
          status: 401,
          message: messages.errors.UNAUTHORIZED_ACCESS,
          code: 'UNAUTHORIZED_ACCESS',
        };
      }

      const { error } = userAddressesSchema.validate(req.body);
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

      const { address_type, street_address, city, state, postal_code, country } = req.body;

      const addAddress = await UserAddressesService.addAddress(
        userId,
        address_type,
        street_address,
        city,
        state,
        postal_code,
        country
      );

      logger.info(`Address added successfully for user: ${userProfile.email}`);

      res.status(201).json({
        success: true,
        message: 'Address added successfully',
        code: 'ADDRESS_ADDED',
        data: addAddress,
      });
    } catch (error) {
      next(error);
    }
  };
}
