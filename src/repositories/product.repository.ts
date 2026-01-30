import { pool } from '../configs/db';
import { Product } from '../models/product.model';

export const createProduct = async (productData: any) => {
  const { name, description, price, stock, created_by} = productData;
    const query = `
        INSERT INTO products (name, description, price, stock, created_by, created_at) 
      VALUES ($1, $2, $3, $4, $5, NOW()) 
      RETURNING id, name, price, stock, created_at
    `;
    const result = await pool.query(query, [name, description, price, stock, created_by ]);
    return result.rows[0];
};

export const updateProduct = async (id: string, productData: any) => {
  const { name, description, price, stock, updated_by } = productData;
   const query = `
        UPDATE products 
        SET name = $1, description = $2, price = $3, stock = $4,updated_by = $5, updated_at = NOW()
        WHERE id = $6 AND deleted_at IS NULL
        RETURNING *
    `;
    const result = await pool.query(query, [name, description, price, stock,updated_by, id]);
    return result.rows[0];
};

export const softDeleteProductId = async (id: string, userId: string) => {
    const query = `
        UPDATE products 
        SET deleted_at = NOW()
        WHERE id = $1 AND created_by = $2 AND deleted_at IS NULL
        RETURNING id
    `;
    const result = await pool.query(query, [id,userId]);
    return result.rows[0] || null;
};


export const getProductId = async (id: string):Promise<Product | null> => {
    const query = `
        SELECT 
            id, 
            name, 
            description, 
            price, 
            stock, 
            created_by, 
            created_at, 
            updated_at
        FROM products 
        WHERE id = $1 AND deleted_at IS NULL
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
};




export const getAllProduct = async (limit: number, offset: number, search: string, minPrice: number, maxPrice: number): Promise<Product[]> => {
    const query = `
        SELECT id, name, description, price, stock, created_at, updated_at 
        FROM products 
        WHERE deleted_at IS NULL 
        AND name ILIKE $3 
        AND price >= $4
        AND price <= $5
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset, `%${search}%`, minPrice, maxPrice]);
    return result.rows;
};

export const countAllProduct = async (search: string, minPrice: number, maxPrice: number): Promise<number> => {
    const query = `SELECT COUNT(*) FROM products
        WHERE deleted_at IS NULL
        AND name ILIKE $1
        AND price >= $2
        AND price <= $3
        `;
    const result = await pool.query(query, [`%${search}%`, minPrice, maxPrice]);
    return parseInt(result.rows[0].count);
};