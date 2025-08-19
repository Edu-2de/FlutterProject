import { Request, Response, NextFunction } from 'express';
import { messages } from '../utils/messages';
import { UserService } from '../services/UserService';
import { UserAddressesService } from '../services/UserAddressesService';
import { userAddressesSchema } from '../validators/userAddressesValidators';
import { ValidationHelpers } from '../utils/validationHelpers';
import logger from '../utils/logger';

export class userAddressesController {
  static addAddress = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = ValidationHelpers.validateUserFromToken(req);

      ValidationHelpers.validateSchema(userAddressesSchema, req.body);

      const userProfile = await ValidationHelpers.validateUserExists(userId);

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
        message: messages.success.ADDRESS_ADDED,
        code: 'ADDRESS_ADDED',
        data: addAddress,
      });
    } catch (error) {
      next(error);
    }
  };
  static addAddressByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = ValidationHelpers.validateUserIdFromParams(req);

      ValidationHelpers.validateSchema(userAddressesSchema, req.body)

      const userProfile = await ValidationHelpers.validateUserExists(userId);

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
        message: messages.success.ADDRESS_ADDED,
        code: 'ADDRESS_ADDED',
        data: addAddress,
      });
    } catch (error) {
      next(error);
    }
  };
}
