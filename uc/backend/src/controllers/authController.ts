import { Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User';
import Profile from '../models/Profile';
import ProviderProfile from '../models/ProviderProfile';
import ErrorResponse from '../utils/errorResponse';
import { AuthRequest } from '../types';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// @desc    Send OTP for registration
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTP = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { email, name, phone, password, role } = req.body;

  if (!email) {
    return next(new ErrorResponse('Please provide an email', 400));
  }

  // Check if user already exists and is verified
  let user = await User.findOne({ email }).select('+verificationOTP +verificationOTPExpire');
  if (user && user.isVerified) {
    return next(new ErrorResponse('Email already registered', 400));
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Hash OTP
  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
  
  // Set OTP expiry (10 minutes)
  const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

  // Create or update user with temporary data
  if (user && !user.isVerified) {
    // Update existing unverified user
    user.name = name || user.name;
    user.phone = phone || user.phone;
    if (password) user.password = password;
    user.role = role || user.role || 'user';
    user.verificationOTP = hashedOTP;
    user.verificationOTPExpire = otpExpire;
    await user.save();
  } else {
    // Create temporary unverified user
    user = await User.create({
      name: name || 'Temporary User',
      email,
      password: password || 'temp123456',
      phone: phone || '0000000000',
      role: role || 'user',
      isVerified: false,
      verificationOTP: hashedOTP,
      verificationOTPExpire: otpExpire
    });
  }

  // Send OTP via email
  try {
    await sendOTPEmail(email, otp);
    
    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
      otpExpire: otpExpire
    });
  } catch (error) {
    // Clean up if email fails
    if (user && !user.isVerified) {
      user.verificationOTP = undefined;
      user.verificationOTPExpire = undefined;
      await user.save();
    }
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Verify OTP and complete registration
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTPAndRegister = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { name, email, password, phone, role, otp } = req.body;

  if (!otp) {
    return next(new ErrorResponse('Please provide OTP', 400));
  }

  // Find user by email with OTP fields
  const user = await User.findOne({ email }).select('+verificationOTP +verificationOTPExpire +password');

  if (!user) {
    return next(new ErrorResponse('No registration found. Please request OTP first.', 400));
  }

  if (user.isVerified) {
    return next(new ErrorResponse('Email already registered', 400));
  }

  if (!user.verificationOTP || !user.verificationOTPExpire) {
    return next(new ErrorResponse('No OTP found. Please request a new one.', 400));
  }

  // Check if OTP expired
  if (new Date() > user.verificationOTPExpire) {
    return next(new ErrorResponse('OTP has expired. Please request a new one.', 400));
  }

  // Hash the provided OTP and compare
  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

  if (hashedOTP !== user.verificationOTP) {
    return next(new ErrorResponse('Invalid OTP', 400));
  }

  // OTP is valid - update user with final details
  user.name = name;
  user.phone = phone;
  user.password = password;
  user.role = role || 'user';
  user.isVerified = true;
  user.verificationOTP = undefined;
  user.verificationOTPExpire = undefined;
  await user.save();

  // Create profile automatically
  await Profile.create({
    user: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    profileImage: 'default-avatar.png'
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Register user (old method - keeping for compatibility)
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
    role: role || 'user',
    isVerified: true // Auto-verify for direct registration
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

// @desc    Send OTP for provider registration
// @route   POST /api/auth/provider/send-otp
// @access  Public
export const sendProviderOTP = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorResponse('Please provide an email', 400));
  }

  // Check if user already exists and is verified
  let user = await User.findOne({ email }).select('+verificationOTP +verificationOTPExpire');
  if (user && user.isVerified) {
    return next(new ErrorResponse('Email already registered', 400));
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Hash OTP
  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
  
  // Set OTP expiry (10 minutes)
  const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

  // Create or update user with temporary data
  if (user && !user.isVerified) {
    user.verificationOTP = hashedOTP;
    user.verificationOTPExpire = otpExpire;
    user.role = 'service-provider';
    await user.save();
  } else {
    // Create temporary unverified user
    user = await User.create({
      name: 'Temp Provider',
      email,
      password: 'temp123456',
      phone: '0000000000',
      role: 'service-provider',
      isVerified: false,
      verificationOTP: hashedOTP,
      verificationOTPExpire: otpExpire
    });
  }

  // Send OTP via email
  try {
    await sendOTPEmail(email, otp);
    
    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
      otpExpire: otpExpire
    });
  } catch (error) {
    // Clean up if email fails
    if (user && !user.isVerified) {
      user.verificationOTP = undefined;
      user.verificationOTPExpire = undefined;
      await user.save();
    }
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Verify OTP and register service provider
// @route   POST /api/auth/provider/register
// @access  Public
export const registerProvider = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { 
    firstName, 
    lastName, 
    middleName,
    email, 
    password, 
    phone, 
    gender,
    legalDocumentType,
    legalDocumentNumber,
    professionalType,
    services,
    profilePicture,
    otp 
  } = req.body;

  if (!otp) {
    return next(new ErrorResponse('Please provide OTP', 400));
  }

  // Find user by email with OTP fields
  const user = await User.findOne({ email }).select('+verificationOTP +verificationOTPExpire +password');

  if (!user) {
    return next(new ErrorResponse('No registration found. Please request OTP first.', 400));
  }

  if (user.isVerified) {
    return next(new ErrorResponse('Email already registered', 400));
  }

  if (!user.verificationOTP || !user.verificationOTPExpire) {
    return next(new ErrorResponse('No OTP found. Please request a new one.', 400));
  }

  // Check if OTP expired
  if (new Date() > user.verificationOTPExpire) {
    return next(new ErrorResponse('OTP has expired. Please request a new one.', 400));
  }

  // Hash the provided OTP and compare
  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

  if (hashedOTP !== user.verificationOTP) {
    return next(new ErrorResponse('Invalid OTP', 400));
  }

  // Validate required provider fields
  if (!firstName || !lastName || !gender || !legalDocumentType || !legalDocumentNumber || !professionalType) {
    return next(new ErrorResponse('Please provide all required provider information', 400));
  }

  if (!services || !Array.isArray(services) || services.length === 0) {
    return next(new ErrorResponse('Please select at least one service', 400));
  }

  // OTP is valid - update user with final details
  user.name = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`;
  user.phone = phone;
  user.password = password;
  user.role = 'service-provider';
  user.isVerified = true;
  user.verificationOTP = undefined;
  user.verificationOTPExpire = undefined;
  await user.save();

  // Create provider profile
  await ProviderProfile.create({
    user: user._id,
    firstName,
    lastName,
    middleName,
    email,
    phone,
    gender,
    legalDocumentType,
    legalDocumentNumber,
    professionalType,
    services,
    profilePicture: profilePicture || 'default-provider-avatar.png',
    verificationStatus: 'pending'
  });

  sendTokenResponse(user, 201, res);
});

// Helper to send OTP email
const sendOTPEmail = async (email: string, otp: string) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER || 'QuickFix <noreply@quickfix.com>',
    to: email,
    subject: 'QuickFix - Email Verification OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6e45e2;">QuickFix Email Verification</h2>
        <p>Hello,</p>
        <p>Thank you for registering with QuickFix. Your OTP for email verification is:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #6e45e2; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>QuickFix Team</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

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
