import mongoose from "mongoose";

const restaurantBookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RestaurantTable",
      required: [true, "Table is required"],
    },
    bookingDate: {
      type: Date,
      required: [true, "Booking date is required"],
    },
    timeSlot: {
      type: String,
      enum: {
        values: [
          "07:00-09:00",
          "09:00-11:00", // Breakfast
          "12:00-14:00",
          "14:00-16:00", // Lunch
          "16:00-18:00",
          "18:00-20:00",
          "20:00-22:00",
          "22:00-23:30", // Dinner/Evening
        ],
        message: "{VALUE} is not a valid time slot",
      },
      required: [true, "Time slot is required"],
    },
    guestsCount: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: [1, "At least 1 guest required"],
    },
    specialRequests: {
      type: String,
      maxlength: [500, "Special requests cannot exceed 500 characters"],
    },
    dietaryRestrictions: [
      {
        type: String,
        trim: true,
      },
    ],
    occasion: {
      type: String,
      enum: [
        "Birthday",
        "Anniversary",
        "Business Meeting",
        "Casual Dining",
        "Date",
        "Other",
      ],
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "seated",
        "completed",
        "cancelled",
        "no-show",
      ],
      default: "pending",
    },
    contactPhone: {
      type: String,
      required: [true, "Contact phone is required"],
    },
    cancellationReason: {
      type: String,
      maxlength: [500, "Cancellation reason cannot exceed 500 characters"],
    },
    cancelledAt: {
      type: Date,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    actualArrivalTime: {
      type: Date,
    },
    actualDepartureTime: {
      type: Date,
    },
    // Auto-expire unconfirmed bookings after 10 minutes
    expiresAt: {
      type: Date,
      index: { expires: "0s" },
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique booking ID
restaurantBookingSchema.pre("save", async function (next) {
  if (!this.bookingId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.bookingId = `RT${timestamp}${random}`.toUpperCase();
  }
  next();
});

// Set expiry time for pending bookings (10 minutes)
restaurantBookingSchema.pre("save", function (next) {
  if (this.isNew && this.status === "pending") {
    this.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  }

  // Remove expiry if confirmed
  if (this.status === "confirmed" && this.expiresAt) {
    this.expiresAt = undefined;
  }

  next();
});

// Indexes for efficient queries
restaurantBookingSchema.index({ user: 1, createdAt: -1 });
restaurantBookingSchema.index({ table: 1, bookingDate: 1, timeSlot: 1 });
restaurantBookingSchema.index({ status: 1 });
restaurantBookingSchema.index({ bookingId: 1 });

// Method to check if booking is active (blocks the table)
restaurantBookingSchema.methods.isActive = function () {
  return ["pending", "confirmed", "seated"].includes(this.status);
};

// Method to check if cancellable
restaurantBookingSchema.methods.isCancellable = function () {
  const now = new Date();
  const bookingDateTime = new Date(this.bookingDate);
  const [startTime] = this.timeSlot.split("-");
  const [hours, minutes] = startTime.split(":");
  bookingDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

  // Can cancel up to 2 hours before booking time
  const twoHoursBefore = new Date(
    bookingDateTime.getTime() - 2 * 60 * 60 * 1000
  );

  return ["pending", "confirmed"].includes(this.status) && now < twoHoursBefore;
};

const RestaurantBooking = mongoose.model(
  "RestaurantBooking",
  restaurantBookingSchema
);

export default RestaurantBooking;
