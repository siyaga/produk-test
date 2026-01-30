import { pool } from '../configs/db';

export const createOrderWithTransaction = async (orderData: any) => {
    const { product_id, customer_id, user_id, quantity, city, price } = orderData;
    const userId = user_id || customer_id;

    const client = await pool.connect();
 try {
        await client.query('BEGIN');

        const updateStockQuery = `
            UPDATE products 
            SET stock = stock - $1 
            WHERE id = $2 AND stock >= $1 
            RETURNING name;
        `;
        const stockCheck = await client.query(updateStockQuery, [quantity, product_id]);
        if(stockCheck.rowCount ===0){
            throw new Error('Insufficient stock');

        }
        const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const invoiceCode = `INV/${datePart}/${randomPart}`;

        const total_price = price * quantity;
        const insertOrder = `
            INSERT INTO orders (invoice_code, user_id, product_id, quantity, total_price, city)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`
        const orderRes = await client.query(insertOrder, [
            invoiceCode, userId, product_id, quantity, total_price, city
        ]);

        await client.query('COMMIT'); 
        return orderRes.rows[0];

 } catch (error) {
    await client.query('ROLLBACK');
    throw error;
 }finally{
    client.release();
 }}

 export const getReportPerCity = async() => {
    const query = `
            SELECT city, COUNT(*) as total_order, SUM(total_price) as total_revenue
            FROM orders
            GROUP BY city
            ORDER BY total_revenue DESC;
    `;
    const res = await pool.query(query);
    return res.rows;
 }

 export const getTopCustomersReport = async() => {
    const query = `
            SELECT u.email, COUNT(o.id) as total_orders, SUM(o.total_price) as total_spent
            FROM users u
            JOIN orders o ON u.id = o.user_id
            GROUP BY u.id, u.email
            ORDER BY total_orders DESC
            LIMIT 5;
    `;
    const res = await pool.query(query);
    return res.rows;
 }

 export const getHourlyRequestReport = async () => {
    const query = `
        SELECT DATE_TRUNC('hour', created_at) as hour, COUNT(*) as request_count
        FROM orders
        GROUP BY hour
        ORDER BY hour DESC;
    `;
    const res = await pool.query(query);
    return res.rows;
};

export const getMonthlyAverageReport = async () => {
    const query = `
        SELECT DATE_TRUNC('month', created_at) as month, AVG(quantity) as average_qty
        FROM orders
        GROUP BY month
        ORDER BY month DESC;
    `;
    const res = await pool.query(query);
    return res.rows;
};