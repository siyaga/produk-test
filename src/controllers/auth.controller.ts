import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepo from '../repositories/user.repository';
import { sendSuccessOne, sendSuccessMany, sendError } from '../utils/response.helper';
import { formatDate } from '../utils/date.helper';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, provider } = req.body;
        
        if (!email || !password) {
            return sendError(res, 'Email and password are required', 400);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userRepo.createUser({ email, password: hashedPassword, provider: provider || 'local' });

        
        return sendSuccessOne(res, user, 'User registered successfully', 201);
    } catch (err: any) {
        return sendError(res, 'Registration failed', 500, err);
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await userRepo.getUserByEmail(email);

        if (!user || user.deleted_at || !(await bcrypt.compare(password, user.password))) {
            return sendError(res, 'Invalid credentials', 401);
        }
        const expires = '1h';
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: expires });
        const {password: _, ...userWithoutPassword } = user;

        const responseData = {
            token,
            expires,
            user: {
                id: user.id,
                email: user.email,
                provider: user.provider,
                created_at: formatDate(user.created_at), // "2026-01-29 14:25:32"
                updated_at: formatDate(user.updated_at)  // "2026-01-29 14:25:32"
            }
        };
        
        return sendSuccessOne(
            res, 
           responseData,
             'Login successful');
    } catch (err: any) {
        return sendError(res, 'Login failed', 500, err);
    }
};

export const listUsers = async (req: Request, res: Response) => {
    try {
        // 1. Calculate pagination parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        // 2. Fetch data and count in parallel for efficiency
        const [users, totalData] = await Promise.all([
            userRepo.getAllUsers(limit, offset),
            userRepo.countAllUsers()
        ]);

        // 3. Map raw data to the professional view format
        const formattedUsers = users.map(user => ({
            id: user.id,
            email: user.email,
            provider: user.provider,
            created_at: formatDate(user.created_at),
            updated_at: formatDate(user.updated_at)
        }));

        // 4. Send response using the 'many' helper
        return sendSuccessMany(
            res, 
            formattedUsers, 
            {
                total_item: totalData,
                total_page: Math.ceil(totalData / limit),
                current_page: page,
                limit: limit
            },
            'Users retrieved successfully'
        );

    } catch (err: any) {
        return sendError(res, 'Failed to fetch users', 500, err);
    }
};