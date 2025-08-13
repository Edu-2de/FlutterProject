import pool from '../database/connection';

export class UserService {
  static async findUserByEmail(email: string) {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return result.rows[0];
  }

  static async createUser(first_name: string, last_name: string, email: string, phone: string, password_hash: string) {
    const result = await pool.query(
      `INSERT INTO users(first_name, last_name, email, phone, password_hash, created_at) 
       VALUES($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING id`,
      [first_name, last_name, email, phone, password_hash]
    );
    return result.rows[0];
  }

  static async findUserById(id: number) {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return result.rows[0];
  }

  static async getUsersProfile() {
    const result = await pool.query(`SELECT * FROM users`);
    return result.rows[0];
  }
}
