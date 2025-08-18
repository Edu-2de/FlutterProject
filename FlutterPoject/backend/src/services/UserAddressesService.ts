import pool from '../database/connection';

export class UserAddressesService {
  static async addAddress(
    address_type: string,
    street_address: string,
    city: string,
    state: string,
    postal_code: string,
    country: string
  ) {
    const result = await pool.query(
      `INSERT INTO user_addresses(address_type, street_address, city, state, postal_code, country, created_at) VALUES($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) RETURNING *`,
      [address_type, street_address, city, state, postal_code, country]
    );
    return result.rows[0];
  }
}
