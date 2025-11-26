import mongoose from 'mongoose';

const roomTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a room type name'],
      enum: ['Single', 'Double', 'Suite', 'Royal Suite', 'Penthouse'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    amenities: [
      {
        type: String,
      },
    ],
    basePrice: {
      type: Number,
      required: [true, 'Please provide base price'],
      min: 0,
    },
    maxOccupancy: {
      type: Number,
      required: [true, 'Please provide max occupancy'],
      min: 1,
    },
    squareFeet: {
      type: Number,
      required: [true, 'Please provide room size in square feet'],
    },
    features: {
      hasBalcony: { type: Boolean, default: false },
      hasJacuzzi: { type: Boolean, default: false },
      hasKitchenette: { type: Boolean, default: false },
      has24HourService: { type: Boolean, default: true },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('RoomType', roomTypeSchema);
