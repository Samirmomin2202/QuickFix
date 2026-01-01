import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Configure multer for memory storage (we'll convert to base64)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// @desc    Upload image
// @route   POST /api/upload
// @access  Private (authenticated users)
router.post('/', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Convert to base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    return res.status(200).json({
      success: true,
      imageUrl: base64Image,
      filename: req.file.originalname
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error uploading image'
    });
  }
});

export default router;
