import Joi from 'joi';

export const userAddressesSchema = Joi.object({
  address_type: Joi.string().required(),
  street_address: Joi.string().required(),
  city: Joi.string().required(),
  postal_code: Joi.string().required(),
  country: Joi.string().required(),
});