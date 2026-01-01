import express from 'express';
import {
  getServices,
  getService,
  getServicesByCategory,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router
  .route('/')
  .get(getServices)
  .post(protect, authorize('admin'), createService);

router.route('/category/:categoryId').get(getServicesByCategory);

router
  .route('/:id')
  .get(getService)
  .put(protect, authorize('admin'), updateService)
  .delete(protect, authorize('admin'), deleteService);

export default router;
