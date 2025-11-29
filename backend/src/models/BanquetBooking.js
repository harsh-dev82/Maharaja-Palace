import mongoose from "mongoose";

const banquetBookingSchema = new mongoose.Schema(
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
    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BanquetHall",
      required: [true, "Hall is required"],
    },
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid time format. Use HH:MM",
      ],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid time format. Use HH:MM",
      ],
    },
    guestsCount: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: [10, "Minimum 10 guests required"],
    },
    eventType: {
      type: String,
      enum: [
        "Wedding",
        "Corporate",
        "Birthday",
        "Anniversary",
        "Conference",
        "Other",
      ],
      required: [true, "Event type is required"],
    },
    pricePerDay: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "cash"],
    },
    paymentId: {
      type: String,
    },
    specialRequests: {
      type: String,
      maxlength: [1000, "Special requests cannot exceed 1000 characters"],
    },
    cateringRequired: {
      type: Boolean,
      default: false,
    },
    decorationRequired: {
      type: Boolean,
      default: false,
    },
    additionalServices: [
      {
        type: String,
        trim: true,
      },
    ],
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
    // Auto-expire unpaid bookings after 30 minutes
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
banquetBookingSchema.pre("save", async function (next) {
  if (!this.bookingId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.bookingId = `BQ${timestamp}${random}`.toUpperCase();
  }
  next();
});

// Set expiry time for pending bookings (30 minutes)
banquetBookingSchema.pre("save", function (next) {
  if (this.isNew && this.status === "pending") {
    this.expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  }

  // Remove expiry if confirmed
  if (this.status === "confirmed" && this.expiresAt) {
    this.expiresAt = undefined;
  }

  next();
});

// Indexes for efficient queries
banquetBookingSchema.index({ user: 1, createdAt: -1 });
banquetBookingSchema.index({ hall: 1, eventDate: 1 });
banquetBookingSchema.index({ status: 1, paymentStatus: 1 });
banquetBookingSchema.index({ bookingId: 1 });

// Method to check if booking is active (blocks the hall)
banquetBookingSchema.methods.isActive = function () {
  return ["pending", "confirmed"].includes(this.status);
};

// Method to check if cancellable
banquetBookingSchema.methods.isCancellable = function () {
  const now = new Date();
  const twoDaysBeforeEvent = new Date(this.eventDate);
  twoDaysBeforeEvent.setDate(twoDaysBeforeEvent.getDate() - 2);

  return this.status === "confirmed" && now < twoDaysBeforeEvent;
};

const BanquetBooking = mongoose.model("BanquetBooking", banquetBookingSchema);

export default BanquetBooking;
