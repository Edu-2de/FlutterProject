import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../database/connection';

const JWT_SECRET = process.env.JWT_SECRET || '';

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export class AuthController {
  static login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email or password is missing',
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
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
        });
        return;
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1h',
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
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
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred',
        code: 'SERVER_ERROR',
      });
    }
  };
  static register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { first_name, last_name, email, phone, password } = req.body;
      if (!first_name || !email || !phone || !password) {
        res.status(400).json({
          success: false,
          message: 'Email or password is missing',
          code: 'MISSING_CREDENTIALS',
        });
        return;
      }

      const checkEmailExists = await pool.query(`SELECT * from users WHERE email = $1`, [email]);
      if (checkEmailExists.rows.length !== 0) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
        });
        return;
      }


    } catch (error) {}
  };
}
