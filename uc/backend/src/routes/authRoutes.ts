import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword
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

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/update', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

export default router;
