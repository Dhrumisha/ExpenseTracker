import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export const validateRequest = (schema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error: any) {
      const errors = error.details.map((detail: any) => ({
        field: detail.path[0],
        message: detail.message
      }));
       res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
      return;
    }
  };
};