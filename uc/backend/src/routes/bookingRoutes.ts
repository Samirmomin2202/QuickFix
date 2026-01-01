import express from 'express';
import {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking
} from '../controllers/bookingController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getBookings)
  .post(createBooking);

router
  .route('/:id')
  .get(getBooking)
  .put(updateBooking)
  .delete(cancelBooking);

export default router;
