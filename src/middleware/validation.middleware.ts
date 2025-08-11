import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { ValidationError } from '../utils/errors';

export const validateStatusUpdate = [
  body('updates')
    .isArray()
    .withMessage('Updates must be an array')
    .notEmpty()
    .withMessage('Updates cannot be empty'),
  
  body('updates.*.userId')
    .isMongoId()
    .withMessage('Invalid user ID format'),
  
  body('updates.*.status')
    .isIn(['pending', 'active', 'blocked'])
    .withMessage('Invalid status value'),
  
  handleValidation
];

export const validatePagination = [
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  body('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be positive'),
    
  handleValidation
];

export const validateGroupId = [
  param('groupId')
    .isMongoId()
    .withMessage('Invalid group ID format'),
  handleValidation
];

export const validateUserId = [
  param('userId')
    .isMongoId()
    .withMessage('Invalid user ID format'),
  handleValidation
];

export const validatePaginationQuery = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be positive'),
  handleValidation
];

function handleValidation(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array()[0].msg);
  }
  next();
}