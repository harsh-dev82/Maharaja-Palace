import mongoose from 'mongoose';

const restaurantBookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      unique: true,
      required: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RestaurantTable',
      required: true,
    },
    bookingDate: {
      type: Date,
      required: [true, 'Please provide booking date'],
    },
    timeSlot: {
      type: String,
      enum: ['breakfast', 'lunch', 'afternoon_tea', 'dinner', 'late_dinner'],
      required: true,
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Please specify number of guests'],
      min: 1,
    },
    specialDietaryRequirements: {
      type: String,
      default: '',
    },
    specialRequests: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate booking number
restaurantBookingSchema.pre('save', async function (next) {
  if (this.isNew) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    this.bookingNumber = `REST-${timestamp}-${random}`;
  }
  next();
});

export default mongoose.model('RestaurantBooking', restaurantBookingSchema);
