import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  sendOTP,
  verifyOTPAndRegister,
  sendProviderOTP,
  registerProvider
} from '../controllers/authController';
import { protect } from '../middleware/auth';
import validate from '../middleware/validate';

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
  validate
];

const sendOTPValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  validate
];

const verifyOTPValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  validate
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const providerOTPValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  validate
];

const providerRegisterValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('gender').isIn(['male', 'female', 'other', 'prefer-not-to-say']).withMessage('Please select a valid gender'),
  body('legalDocumentType').isIn(['aadhar', 'pan', 'passport', 'driving-license', 'voter-id']).withMessage('Please select a valid document type'),
  body('legalDocumentNumber').trim().notEmpty().withMessage('Legal document number is required'),
  body('professionalType').trim().notEmpty().withMessage('Professional type is required'),
  body('services').isArray({ min: 1 }).withMessage('Please select at least one service'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  validate
];

router.post('/send-otp', sendOTPValidation, sendOTP);
router.post('/verify-otp', verifyOTPValidation, verifyOTPAndRegister);
router.post('/provider/send-otp', providerOTPValidation, sendProviderOTP);
router.post('/provider/register', providerRegisterValidation, registerProvider);
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/update', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

export default router;
