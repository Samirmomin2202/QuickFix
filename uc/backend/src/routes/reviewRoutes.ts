import express from 'express';
import {
  getServiceReviews,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/reviewController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/service/:serviceId').get(getServiceReviews);

router.use(protect);

router
  .route('/')
  .post(createReview);

router
  .route('/:id')
  .put(updateReview)
  .delete(deleteReview);

export default router;
