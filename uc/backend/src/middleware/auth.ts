import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User';
import ErrorResponse from '../utils/errorResponse';
import { AuthRequest } from '../types';

interface JwtPayload {
  id: string;
  role: string;
}

// Protect routes - verify JWT token
export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (!user.isActive) {
      return next(new ErrorResponse('User account is deactivated', 403));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user?.role}' is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
