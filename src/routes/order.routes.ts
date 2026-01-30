import { Router } from 'express';
import * as orderCtrl from '../controllers/order.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /api/v1/orders/checkout:
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order (Checkout)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - quantity
 *               - city
 *             properties:
 *               product_id:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the product to purchase
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Quantity of items
 *               city:
 *                 type: string
 *                 description: Shipping city
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request (e.g. insufficient stock)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.post('/checkout', authenticate, orderCtrl.checkout);

/**
 * @openapi
 * /api/v1/orders/report:
 *   get:
 *     tags: [Orders]
 *     summary: Get sales report per city
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       city:
 *                         type: string
 *                       total_order:
 *                         type: string
 *                       total_revenue:
 *                         type: string
 */
router.get('/report', authenticate, orderCtrl.getCityReport);

/**
 * @openapi
 * /api/v1/orders/system-report:
 *   get:
 *     tags: [Orders]
 *     summary: Get system-wide reports (Top Customers, Hourly Requests, Monthly Average)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System reports retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 */
router.get('/system-report', authenticate, orderCtrl.getSystemReport);

/**
 * @openapi
 * /api/v1/orders/currency:
 *   get:
 *     tags: [Orders]
 *     summary: Get current USD exchange rates
 *     responses:
 *       200:
 *         description: Currency data retrieved successfully
 */
router.get('/currency', orderCtrl.getCurrencyData);

export default router;