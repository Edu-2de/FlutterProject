import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../database/connection';
import { messages } from '../utils/messages';
import { isValidEmail, isValidPassword } from '../utils/validators';

const JWT_SECRET = process.env.JWT_SECRET || '';
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

export class AuthController {
  static login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw {
          status: 400,
          message: messages.errors.MISSING_CREDENTIALS,
          code: 'MISSING_CREDENTIALS',
        };
      }

      const checkUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

      if (checkUser.rows.length === 0) {
        throw {
          status: 401,
          message: messages.errors.INVALID_CREDENTIALS,
          code: 'INVALID_CREDENTIALS',
        };
      }

      const user = checkUser.rows[0];
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        throw {
          status: 401,
          message: messages.errors.INVALID_CREDENTIALS,
          code: 'INVALID_CREDENTIALS',
        };
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1h',
      });

      res.status(200).json({
        success: true,
        message: messages.success.LOGIN_SUCCESS,
        code: 'LOGIN_SUCCESS',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        },
      });
    } catch (error) {
      next(error); 
    }
  };

  static register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { first_name, last_name = '', email, phone, password } = req.body;

      if (!first_name || !email || !phone || !password) {
        throw {
          status: 400,
          message: messages.errors.MISSING_CREDENTIALS,
          code: 'MISSING_CREDENTIALS',
        };
      }

      if (!isValidEmail(email)) {
        throw {
          status: 400,
          message: messages.errors.INVALID_EMAIL_FORMAT,
          code: 'INVALID_EMAIL_FORMAT',
        };
      }

      if (!isValidPassword(password)) {
        throw {
          status: 400,
          message: messages.errors.INVALID_PASSWORD_FORMAT,
          code: 'INVALID_PASSWORD_FORMAT',
        };
      }

      const checkEmailExists = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
      if (checkEmailExists.rows.length !== 0) {
        throw {
          status: 409,
          message: messages.errors.EMAIL_ALREADY_EXISTS,
          code: 'EMAIL_ALREADY_EXISTS',
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUserResult = await pool.query(
        `INSERT INTO users(first_name, last_name, email, phone, password_hash, created_at) 
         VALUES($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING id`,
        [first_name, last_name, email, phone, hashedPassword]
      );
      const newUser = newUserResult.rows[0];

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
}