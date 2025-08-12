import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../database/connection';
import { messages } from '../utils/messages';

const JWT_SECRET = process.env.JWT_SECRET || '';

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};

export class AuthController {
  static login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: messages.errors.MISSING_CREDENTIALS,
          code: 'MISSING_CREDENTIALS',
        });
        return;
      }

      const checkUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

      if (checkUser.rows.length === 0) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
        });
        return;
      }

      const user = checkUser.rows[0];

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        res.status(401).json({
          success: false,
          message: messages.errors.INVALID_CREDENTIALS,
          code: 'INVALID_CREDENTIALS',
        });
        return;
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
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        message: messages.errors.SERVER_ERROR,
        code: 'SERVER_ERROR',
      });
    }
  };
  static register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { first_name, last_name = '', email, phone, password } = req.body;
      if (!first_name || !email || !phone || !password) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields',
          code: 'MISSING_CREDENTIALS',
        });
        return;
      }

      if (!isValidEmail(email)) {
        res.status(400).json({
          success: false,
          message: 'Invalid email format',
          code: 'INVALID_EMAIL_FORMAT',
        });
        return;
      }

      if (!isValidPassword(password)) {
        res.status(400).json({
          success: false,
          message:
            'Password must be at least 6 characters long, include an uppercase letter, a lowercase letter, a number, and a special character',
          code: 'INVALID_PASSWORD_FORMAT',
        });
        return;
      }

      const checkEmailExists = await pool.query(`SELECT * from users WHERE email = $1`, [email]);
      if (checkEmailExists.rows.length !== 0) {
        res.status(409).json({
          success: false,
          message: 'Email already in use',
          code: 'EMAIL_ALREADY_EXISTS',
        });
        return;
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
        message: 'User registered successfully',
        code: 'USER_REGISTERED',
        data: {
          userId: newUser.id,
        },
      });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred',
        code: 'SERVER_ERROR',
      });
    }
  };
}
