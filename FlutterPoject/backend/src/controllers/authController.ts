import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../database/connection';

//coming from .env
const JWT_SECRET = process.env.JWT_SECRET || '';
