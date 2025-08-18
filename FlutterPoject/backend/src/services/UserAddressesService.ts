import pool from '../database/connection';

export class UserAddressesService {
  static async addAddress(
    user_id: number,
    address_type: string,
    street_address: string,
    city: string,
    state: string,
    postal_code: string,
    country: string
  ) {
    const result = await pool.query(
      `INSERT INTO user_addresses(user_id, address_type, street_address, city, state, postal_code, country, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP) RETURNING *`,
      [user_id, address_type, street_address, city, state, postal_code, country]
    );
    return result.rows[0];
  }
}
