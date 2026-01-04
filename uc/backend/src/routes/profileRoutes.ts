import express from 'express';
import { body } from 'express-validator';
import {
  getMyProfile,
  getProfileByUserId,
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
  upload
} from '../controllers/profileController';
import { protect } from '../middleware/auth';
import validate from '../middleware/validate';

const router = express.Router();

// Validation middleware
const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer-not-to-say']).withMessage('Invalid gender'),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
  body('age').optional().isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
  validate
];

// Get current user's profile
router.get('/me', protect, getMyProfile);

// Get profile by user ID
router.get('/user/:userId', getProfileByUserId);

// Update profile
router.put('/me', protect, updateProfileValidation, updateProfile);

// Upload profile image
router.put('/upload-image', protect, upload.single('profileImage'), uploadProfileImage);

// Delete profile image
router.delete('/delete-image', protect, deleteProfileImage);

export default router;
