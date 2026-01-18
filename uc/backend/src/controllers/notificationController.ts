import { Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification';
import ErrorResponse from '../utils/errorResponse';
import { AuthRequest } from '../types';

// @desc    Get all notifications for logged in user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const notifications = await Notification.find({ recipient: req.user!._id })
    .populate('relatedBooking', 'bookingId status scheduledDate')
    .populate('relatedService', 'name')
    .sort({ createdAt: -1 })
    .limit(50); // Limit to last 50 notifications

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications
  });
});

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const count = await Notification.countDocuments({ 
    recipient: req.user!._id, 
    read: false 
  });

  res.status(200).json({
    success: true,
    data: { count }
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is notification recipient
  if (notification.recipient.toString() !== req.user!._id.toString()) {
    return next(new ErrorResponse('Not authorized to update this notification', 403));
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
export const markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  await Notification.updateMany(
    { recipient: req.user!._id, read: false },
    { read: true }
  );

  res.status(200).json({
    success: true,
    data: { message: 'All notifications marked as read' }
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is notification recipient
  if (notification.recipient.toString() !== req.user!._id.toString()) {
    return next(new ErrorResponse('Not authorized to delete this notification', 403));
  }

  await notification.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Create notification (helper function - not exposed as route)
export const createNotification = async (data: {
  recipient: string;
  type: 'booking_assigned' | 'booking_updated' | 'booking_cancelled' | 'payment_received' | 'review_received';
  title: string;
  message: string;
  relatedBooking?: string;
  relatedService?: string;
}) => {
  const notification = await Notification.create(data);
  return notification;
};
