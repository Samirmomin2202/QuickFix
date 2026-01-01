import { Response, NextFunction } from 'express';
import User from '../models/User';
import ErrorResponse from '../utils/errorResponse';
import { AuthRequest } from '../types';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Check if user is admin
    if (req.user!.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to access this route', 403));
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to access this route', 403));
    }

    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to access this route', 403));
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to access this route', 403));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
