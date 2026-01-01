import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    res.status(400).json({
      success: false,
      error: errorMessages
    });
    return;
  }
  
  next();
};

export default validate;
