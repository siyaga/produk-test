import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.helper';

/**
 * Interface to extend the standard Express Request
 * This allows us to access req.user.id in our controllers
 */
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

/**
 * Middleware to protect routes and verify JWT tokens
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return sendError(res, 'Authentication required. No Authorization header found.', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return sendError(res, 'Authentication required. Invalid Bearer token format.', 401);
    }

    try {
        const secret = process.env.JWT_SECRET || 'secret';
        const decoded = jwt.verify(token, secret) as { id: string; email: string };

        req.user = {
            id: decoded.id,
            email: decoded.email
        };

        // 4. Pass control to the next middleware/controller
        next();
    } catch (err) {
        // 403 Forbidden: Token is invalid or expired
        return sendError(res, 'Invalid or expired session. Please log in again.', 403);
    }
};