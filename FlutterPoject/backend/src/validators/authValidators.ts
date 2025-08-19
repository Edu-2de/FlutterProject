import Joi from 'joi';

export const registerSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().optional().allow(''),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    .required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional().allow(''),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    .optional(),
  role: Joi.string().valid('admin', 'manager', 'customer').optional(),
});

export const createUserAdmin = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().required(),
  phone: Joi.string().required(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    .required(),
});
