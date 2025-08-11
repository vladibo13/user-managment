import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb';
import { AppError } from '../utils/errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: Object.values(err).map(e => e.message)
    });
  }

  // Handle MongoDB duplicate key errors
  if (err instanceof MongoError && err.code === 11000) {
    return res.status(409).json({
      status: 'error',
      message: 'Duplicate value not allowed'
    });
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  // Return generic error message for unexpected errors
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};