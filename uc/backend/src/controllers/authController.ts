import { Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User';
import ErrorResponse from '../utils/errorResponse';
import { AuthRequest } from '../types';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { name, email, password, phone, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || 'user'
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  if (!user.isActive) {
    return next(new ErrorResponse('Account is deactivated', 403));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user!._id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user details
// @route   PUT /api/auth/update
// @access  Private
export const updateDetails = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address
  };

  const user = await User.findByIdAndUpdate(req.user!._id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user!._id).select('+password');

  // Check current password
  if (!(await user!.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user!.password = req.body.newPassword;
  await user!.save();

  sendTokenResponse(user!, 200, res);
});

// Helper to get token from model, create cookie and send response
const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user
  });
};
