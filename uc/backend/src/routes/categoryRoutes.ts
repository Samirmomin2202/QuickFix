import express from 'express';
import {
  getCategories,
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router
  .route('/')
  .get(getCategories)
  .post(protect, authorize('admin'), createCategory);

router.get('/all', protect, authorize('admin'), getAllCategories);

router
  .route('/:id')
  .get(getCategory)
  .put(protect, authorize('admin'), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

export default router;
