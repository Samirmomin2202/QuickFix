import mongoose, { Schema, Model } from 'mongoose';
import { IProfile } from '../types';

const ProfileSchema = new Schema<IProfile>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    default: null
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  age: {
    type: Number,
    default: null
  },
  profileImage: {
    type: String,
    default: 'default-avatar.png'
  },
  address: {
    street: {
      type: String,
      default: null
    },
    city: {
      type: String,
      default: null
    },
    state: {
      type: String,
      default: null
    },
    zipCode: {
      type: String,
      default: null
    },
    country: {
      type: String,
      default: 'India'
    },
    fullAddress: {
      type: String,
      default: null
    },
    coordinates: {
      lat: {
        type: Number,
        default: null
      },
      lng: {
        type: Number,
        default: null
      }
    }
  },
  bio: {
    type: String,
    maxlength: 500,
    default: null
  },
  occupation: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries (user index already created by unique: true)
ProfileSchema.index({ email: 1 });

const Profile: Model<IProfile> = mongoose.model<IProfile>('Profile', ProfileSchema);

export default Profile;
