import pool from '../database/connection';
import bcrypt from 'bcryptjs';

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

  static async findUserByPhone(phone: string) {
    const result = await pool.query(`SELECT * FROM users WHERE phone = $1`, [phone]);
    return result.rows[0];
  }

  static async updateUser(userId: number, updateData: any) {
    const fields = [];
    const values = [];
    let idx = 1;

    // Processa cada campo que pode ser atualizado
    if (updateData.first_name !== undefined) {
      fields.push(`first_name = $${idx++}`);
      values.push(updateData.first_name);
    }

    if (updateData.last_name !== undefined) {
      fields.push(`last_name = $${idx++}`);
      values.push(updateData.last_name);
    }

    if (updateData.email !== undefined) {
      fields.push(`email = $${idx++}`);
      values.push(updateData.email);
    }

    if (updateData.phone !== undefined) {
      fields.push(`phone = $${idx++}`);
      values.push(updateData.phone);
    }

    if (updateData.password !== undefined) {
      const password_hash = await bcrypt.hash(updateData.password, 10);
      fields.push(`password_hash = $${idx++}`);
      values.push(password_hash);
    }

    if (updateData.role !== undefined) {
      fields.push(`role = $${idx++}`);
      values.push(updateData.role);
    }

  
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

 
    if (fields.length === 1) {
      return await this.findUserById(userId);
    }

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async deleteUserProfile(userId: number) {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
  }
}
