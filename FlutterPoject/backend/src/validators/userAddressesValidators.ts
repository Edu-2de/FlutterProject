import Joi from 'joi';

export const userAddressesSchema = Joi.object({
  address_type: Joi.string().valid('home', 'work', 'other').required().messages({
    'any.required': 'Address type is required',
    'any.only': 'Address type must be one of: home, work, other'
  }),
  street_address: Joi.string().min(5).max(255).required().messages({
    'any.required': 'Street address is required',
    'string.min': 'Street address must be at least 5 characters long',
    'string.max': 'Street address cannot exceed 255 characters'
  }),
  city: Joi.string().min(2).max(100).required().messages({
    'any.required': 'City is required',
    'string.min': 'City must be at least 2 characters long',
    'string.max': 'City cannot exceed 100 characters'
  }),
  state: Joi.string().min(2).max(100).required().messages({
    'any.required': 'State is required',
    'string.min': 'State must be at least 2 characters long',
    'string.max': 'State cannot exceed 100 characters'
  }),
  postal_code: Joi.string().min(5).max(20).required().messages({
    'any.required': 'Postal code is required',
    'string.min': 'Postal code must be at least 5 characters long',
    'string.max': 'Postal code cannot exceed 20 characters'
  }),
  country: Joi.string().min(2).max(100).required().messages({
    'any.required': 'Country is required',
    'string.min': 'Country must be at least 2 characters long',
    'string.max': 'Country cannot exceed 100 characters'
  }),
});

export const updateAddressSchema = Joi.object({
  address_type: Joi.string().valid('home', 'work', 'other').optional(),
  street_address: Joi.string().min(5).max(255).optional(),
  city: Joi.string().min(2).max(100).optional(),
  state: Joi.string().min(2).max(100).optional(),
  postal_code: Joi.string().min(5).max(20).optional(),
  country: Joi.string().min(2).max(100).optional(),
}).min(1);