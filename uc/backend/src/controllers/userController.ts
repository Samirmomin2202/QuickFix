import { Response, NextFunction } from 'express';
import User from '../models/User';
import Profile from '../models/Profile';
import ProviderProfile from '../models/ProviderProfile';
import ErrorResponse from '../utils/errorResponse';
import { AuthRequest } from '../types';

// @desc    Get all users with statistics
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Check if user is admin
    if (req.user!.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to access this route', 403));
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });

    // Get statistics
    const stats = {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length,
      byRole: {
        admin: users.filter(u => u.role === 'admin').length,
        user: users.filter(u => u.role === 'user').length,
        serviceProvider: users.filter(u => u.role === 'service-provider').length
      }
    };

    res.status(200).json({
      success: true,
      count: users.length,
      stats,
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

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user!._id.toString()) {
      return next(new ErrorResponse('You cannot delete your own account', 400));
    }

    // Delete associated profile
    await Profile.deleteMany({ user: user._id });
    
    // Delete associated provider profile if exists
    if (user.role === 'service-provider') {
      await ProviderProfile.deleteMany({ user: user._id });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User and associated data deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
