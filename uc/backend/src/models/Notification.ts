import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  type: 'booking_assigned' | 'booking_updated' | 'booking_cancelled' | 'payment_received' | 'review_received';
  title: string;
  message: string;
  relatedBooking?: mongoose.Types.ObjectId;
  relatedService?: mongoose.Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please add a recipient'],
      index: true
    },
    type: {
      type: String,
      enum: ['booking_assigned', 'booking_updated', 'booking_cancelled', 'payment_received', 'review_received'],
      required: [true, 'Please add a notification type']
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Please add a message'],
      trim: true
    },
    relatedBooking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking'
    },
    relatedService: {
      type: Schema.Types.ObjectId,
      ref: 'Service'
    },
    read: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient querying
NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
