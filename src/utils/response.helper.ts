import { Response } from 'express';

export const sendSuccessOne = (
  res: Response, 
  data: any, 
  message: string = 'Data retrieved successfully', 
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};


export const sendSuccessMany = (
    res: Response, 
    data: any[], 
    pagination: {
        total_item: number;
        total_page: number;
        current_page: number;
        limit: number;
    }, 
    message: string = 'Success'
) => {
    return res.status(200).json({
        status: true,
        message,
        data,       // Pure array of items
        pagination  // Independent metadata object
    });
};

export const sendError = (
  res: Response, 
  message: string = 'Internal Server Error', 
  statusCode: number = 500, 
  error: any = null
) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    error: error?.message || error,
  });
};