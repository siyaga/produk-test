import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as productRepo from '../repositories/product.repository';
import * as orderRepo from '../repositories/order.repository';
import { sendSuccessOne, sendSuccessMany, sendError } from '../utils/response.helper';
import * as externalService from '../services/external.service';
import {formatDateSystemReport} from '../utils/date.helper'

export const checkout = async (req: AuthRequest, res: Response) => {
    try {
        const { product_id, quantity, city } = req.body;
        const userId = req.user?.id;

        const product = await productRepo.getProductId(product_id);
        if (!product) {
            return sendError(res, 'Product not found', 404);
        }
       const order = await orderRepo.createOrderWithTransaction({
            product_id,
            customer_id: userId,
            quantity,
            city,
            price: product.price
        });
        
        
        return sendSuccessOne(res, order, 'Order created successfully', 201);
    } catch (err: any) {
        return sendError(res, 'Order failed', 500, err);
    }
};


export const getCityReport = async (req: AuthRequest, res: Response) => {
    try {
        const report = await orderRepo.getReportPerCity();
        return sendSuccessOne(res, report, 'City sales report retrieved successfully');
    } catch (err: any) {
        return sendError(res, 'Failed to retrieve report', 500, err);
    }
};

export const getSystemReport = async (req: AuthRequest, res: Response) => {
    try {
        const [topCustomers, hourlyRequests, monthlyAvg] = await Promise.all([
            orderRepo.getTopCustomersReport(),
            orderRepo.getHourlyRequestReport(),
            orderRepo.getMonthlyAverageReport()
        ]);

        // Format Hourly Requests for human readability
        const formattedHourly = hourlyRequests.map((item: any) => ({
            ...item,
            // Convert raw timestamp to human-friendly string (e.g., "Jan 30, 2026, 9:00 PM")
            hour: formatDateSystemReport(item.hour) 
        }));

        // Format Monthly Average for human readability
        const formattedMonthly = monthlyAvg.map((item: any) => ({
            ...item,
            // Convert raw timestamp to month/year (e.g., "January 2026")
            month: new Date(item.month).toLocaleString('en-US', { month: 'long', year: 'numeric' })
        }));

        return sendSuccessOne(res, {
            top_customers: topCustomers,
            hourly_requests: formattedHourly,
            monthly_average: formattedMonthly
        }, 'System reports retrieved successfully');
    } catch (err: any) {
        return sendError(res, 'Failed to retrieve system reports', 500, err);
    }
};

export const getCurrencyData = async (req: Request, res: Response) => {
    try {
        const data = await externalService.getExternalExchangeRate();
        return sendSuccessOne(res, data, 'External currency data retrieved');
    } catch (err: any) {
        return sendError(res, 'External API error', 500, err);
    }
};