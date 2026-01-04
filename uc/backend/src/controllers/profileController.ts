import { Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import Profile from '../models/Profile';
import ErrorResponse from '../utils/errorResponse';
import { AuthRequest } from '../types';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/profiles');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// @desc    Get current user's profile
// @route   GET /api/profile/me
// @access  Private
export const getMyProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let profile = await Profile.findOne({ user: req.user!._id }).populate('user', 'role isActive');

  // If profile doesn't exist, create it automatically (for existing users)
  if (!profile) {
    profile = await Profile.create({
      user: req.user!._id,
      name: req.user!.name,
      email: req.user!.email,
      phone: req.user!.phone,
      profileImage: 'default-avatar.png'
    });

    // Populate user field after creation
    await profile.populate('user', 'role isActive');
  }

  res.status(200).json({
    success: true,
    data: profile
  });
});

// @desc    Get profile by user ID
// @route   GET /api/profile/user/:userId
// @access  Public
export const getProfileByUserId = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const profile = await Profile.findOne({ user: req.params.userId }).populate('user', 'role isActive');

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  res.status(200).json({
    success: true,
    data: profile
  });
});

// @desc    Update profile
// @route   PUT /api/profile/me
// @access  Private
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const allowedFields = [
    'name',
    'phone',
    'gender',
    'dateOfBirth',
    'age',
    'bio',
    'occupation',
    'address'
  ];

  const updateData: any = {};
  
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updateData[key] = req.body[key];
    }
  });

  // Calculate age from date of birth if provided
  if (updateData.dateOfBirth) {
    const dob = new Date(updateData.dateOfBirth);
    const ageDiff = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiff);
    updateData.age = Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  const profile = await Profile.findOneAndUpdate(
    { user: req.user!._id },
    updateData,
    {
      new: true,
      runValidators: true
    }
  );

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  res.status(200).json({
    success: true,
    data: profile
  });
});

// @desc    Upload profile image
// @route   PUT /api/profile/upload-image
// @access  Private
export const uploadProfileImage = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const profile = await Profile.findOne({ user: req.user!._id });

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  // Delete old profile image if it's not the default
  if (profile.profileImage && profile.profileImage !== 'default-avatar.png') {
    const oldImagePath = path.join(__dirname, '../../uploads/profiles', profile.profileImage);
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  // Update profile image
  profile.profileImage = req.file.filename;
  await profile.save();

  res.status(200).json({
    success: true,
    data: {
      profileImage: profile.profileImage,
      imageUrl: `/uploads/profiles/${profile.profileImage}`
    }
  });
});

// @desc    Delete profile image (set to default)
// @route   DELETE /api/profile/delete-image
// @access  Private
export const deleteProfileImage = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const profile = await Profile.findOne({ user: req.user!._id });

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  // Delete current image if it's not the default
  if (profile.profileImage && profile.profileImage !== 'default-avatar.png') {
    const imagePath = path.join(__dirname, '../../uploads/profiles', profile.profileImage);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  // Set to default
  profile.profileImage = 'default-avatar.png';
  await profile.save();

  res.status(200).json({
    success: true,
    message: 'Profile image deleted successfully'
  });
});
