import { pool } from '../configs/db';
import { User } from '../models/user.model';

export const createUser = async (userData: any) => {
  const { email, password, provider } = userData;
    const query = `
        INSERT INTO users (email, password, provider) 
        VALUES ($1, $2, $3) 
        RETURNING id, email, provider, created_at
    `;
    const result = await pool.query(query, [email, password, provider || 'local']);
    return result.rows[0];
};

export const getUserByEmail = async (email: string) => {
    const query = `
        SELECT 
            id, 
            email, 
            password, 
            provider, 
            created_at, 
            updated_at, 
            deleted_at 
        FROM users 
        WHERE email = $1 AND deleted_at IS NULL
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

export const getAllUsers = async (limit: number, offset: number): Promise<User[]> => {
    const query = `
        SELECT id, email, provider, created_at, updated_at 
        FROM users 
        WHERE deleted_at IS NULL 
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
};

// Fungsi 2: Hitung total user (untuk keperluan pagination di response)
export const countAllUsers = async (): Promise<number> => {
    const query = `SELECT COUNT(*) FROM users WHERE deleted_at IS NULL`;
    const result = await pool.query(query);
    return parseInt(result.rows[0].count);
};