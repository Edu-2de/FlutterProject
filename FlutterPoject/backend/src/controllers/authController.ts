import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../database/connection';

//coming from .env
const JWT_SECRET = process.env.JWT_SECRET || '';

export class AuthController {
  static login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      //error if email or password is missing
      if (!email || !password) {
        res.status(400).json({ message: 'Email or password is missing' });
        return;
      }

      const checkResult = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
      //error if the db query does not return any data
      if (checkResult.rows.length === 0) {
        res.status(400).json({ message: 'This user does not exist' });
        return;
      }
    } catch (error) {}
  };
}
