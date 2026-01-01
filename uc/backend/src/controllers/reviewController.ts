import { Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import Review from '../models/Review';
import Booking from '../models/Booking';
import ErrorResponse from '../utils/errorResponse';
import { AuthRequest } from '../types';

// @desc    Get reviews for a service
// @route   GET /api/reviews/service/:serviceId
// @access  Public
export const getServiceReviews = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const reviews = await Review.find({ service: req.params.serviceId })
    .populate('user', 'name profileImage')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  req.body.user = req.user!._id;

  // Check if booking exists and is completed
  const booking = await Booking.findById(req.body.booking);

  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }

  if (booking.user.toString() !== req.user!._id.toString()) {
    return next(new ErrorResponse('Not authorized to review this booking', 403));
  }

  if (booking.status !== 'completed') {
    return next(new ErrorResponse('Can only review completed bookings', 400));
  }

  // Set service from booking
  req.body.service = booking.service;

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is review owner
  if (review.user.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this review', 403));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is review owner or admin
  if (review.user.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this review', 403));
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
