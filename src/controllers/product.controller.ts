import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as productRepo from '../repositories/product.repository';
import { sendSuccessOne, sendSuccessMany, sendError } from '../utils/response.helper';
import { formatDate } from '../utils/date.helper';

export const createProduct = async (req: AuthRequest, res: Response) => {
    try {
        
        const userId = req.user?.id;
        const { name, description, price, stock } = req.body;
        
        if(!name ){
            return sendError(res, 'Name is required', 400);
        }
        if(!description ){
            return sendError(res, 'Description is required', 400);
        }
        if(!price ){
            return sendError(res, 'Price is required', 400);    
        }
        if(!stock ){
            return sendError(res, 'Stock is required', 400);
        }
       
        const user = await productRepo.createProduct({ name, description, price, stock, created_by: userId });

        
        return sendSuccessOne(res, user, 'Product successfully Created', 201);
    } catch (err: any) {
        return sendError(res, 'Product failed', 500, err);
    }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
    try {
        
        const userId = req.user?.id;
        const { name, description, price, stock } = req.body;
        const { id }  = req.params;

        if (typeof id !== 'string') {
            return sendError(res, 'Invalid ID format', 400);
        }

        const product = await productRepo.getProductId(id);

        if (!product || product.deleted_at){
            return sendError(res, 'Product not found', 404);
        }
        if (product.created_by !== userId) {
            return sendError(res, 'Forbidden: You do not own this product', 403);
        }

        if (!name || !description || !price || !stock) {
            return sendError(res, 'All fields are required', 400);
        }

       
        const user = await productRepo.updateProduct(id,{ name, description, price, stock, updated_by:userId });

        
        return sendSuccessOne(res, user, 'Product successfully Created', 201);
    } catch (err: any) {
        return sendError(res, 'Product failed', 500, err);
    }
};



export const deleteProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { id }  = req.params;
        
        const userId = req.user?.id;

        if (typeof id !== 'string') {
            return sendError(res, 'Invalid ID format', 400);
        }
        const product = await productRepo.getProductId(id);

        if (!product) {
            return sendError(res, 'Product not found', 404);
        }

        if (product.created_by !== userId) {
            return sendError(res, 'Forbidden: You do not own this product', 403);
        }

        
        await productRepo.softDeleteProductId(id, userId);


return sendSuccessOne(res, null, 'Product deleted successfully', 200);
    } catch (err: any) {
        return sendError(res, 'Login failed', 500, err);
    }
};

export const detailProduct = async (req: Request, res: Response) => {
    try {
        const { id }  = req.params;

        if (typeof id !== 'string') {
            return sendError(res, 'Invalid ID format', 400);
        }
        const product = await productRepo.getProductId(id); 

        
        if (!product || product.deleted_at){
            return sendError(res, 'Product not found', 404);
        }

return sendSuccessOne(res, product, 'Product retrieved successfully', 200);
    } catch (err: any) {
        return sendError(res, 'Login failed', 500, err);
    }
};

export const listProducts = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = (req.query.search as string) || '';
        const offset = (page - 1) * limit;

        const [products, totalData] = await Promise.all([
            productRepo.getAllProduct(limit, offset, search),
            productRepo.countAllProduct(search)
        ]);

        const formattedProducts = products.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            created_at: formatDate(product.created_at),
            updated_at: formatDate(product.updated_at)
        }));

        // 4. Send response using the 'many' helper
        return sendSuccessMany(
            res, 
            formattedProducts, 
            {
                total_item: totalData,
                total_page: Math.ceil(totalData / limit),
                current_page: page,
                limit: limit
            },
            'Products retrieved successfully'
        );

    } catch (err: any) {
        return sendError(res, 'Failed to fetch users', 500, err);
    }
};