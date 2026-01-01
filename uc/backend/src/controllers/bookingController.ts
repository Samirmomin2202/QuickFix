import { Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking';
import Service from '../models/Service';
import ErrorResponse from '../utils/errorResponse';
import { AuthRequest } from '../types';

// @desc    Get all bookings for logged in user
// @route   GET /api/bookings
// @access  Private
export const getBookings = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let query: any = {};

  // If user is not admin, only show their bookings
  if (req.user!.role !== 'admin') {
    if (req.user!.role === 'service-provider') {
      query.serviceProvider = req.user!._id;
    } else {
      query.user = req.user!._id;
    }
  }

  const bookings = await Booking.find(query)
    .populate('user', 'name email phone')
    .populate('service', 'name price duration image')
    .populate('serviceProvider', 'name phone')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('service', 'name price duration image')
    .populate('serviceProvider', 'name phone');

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is booking owner or admin
  if (booking.user.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this booking', 403));
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Add user to req.body
  req.body.user = req.user!._id;

  // Get service to calculate total amount
  const service = await Service.findById(req.body.service);

  if (!service) {
    return next(new ErrorResponse('Service not found', 404));
  }

  // Calculate total amount
  req.body.totalAmount = service.discountPrice || service.price;

  const booking = await Booking.create(req.body);

  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBooking = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is booking owner or service provider or admin
  const isOwner = booking.user.toString() === req.user!._id.toString();
  const isProvider = booking.serviceProvider?.toString() === req.user!._id.toString();
  const isAdmin = req.user!.role === 'admin';

  if (!isOwner && !isProvider && !isAdmin) {
    return next(new ErrorResponse('Not authorized to update this booking', 403));
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is booking owner
  if (booking.user.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to cancel this booking', 403));
  }

  booking.status = 'cancelled';
  booking.cancellationReason = req.body.cancellationReason || 'Cancelled by user';
  await booking.save();

  res.status(200).json({
    success: true,
    data: booking
  });
});
