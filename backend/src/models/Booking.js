import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
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
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room is required"],
    },
    roomType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: [true, "Room type is required"],
    },
    checkInDate: {
      type: Date,
      required: [true, "Check-in date is required"],
    },
    checkOutDate: {
      type: Date,
      required: [true, "Check-out date is required"],
    },
    guestsCount: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: [1, "At least 1 guest is required"],
    },
    numberOfNights: {
      type: Number,
    },
    pricePerNight: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    status: {
      type: String,
      enum: {
        values: [
          "pending",
          "confirmed",
          "checked-in",
          "checked-out",
          "cancelled",
        ],
        message: "{VALUE} is not a valid status",
      },
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
      type: String, // Razorpay payment ID
    },
    specialRequests: {
      type: String,
      maxlength: [500, "Special requests cannot exceed 500 characters"],
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
    actualCheckInDate: {
      type: Date,
    },
    actualCheckOutDate: {
      type: Date,
    },
    // Auto-expire unpaid bookings after 15 minutes
    expiresAt: {
      type: Date,
      index: { expires: "0s" }, // TTL index
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique booking ID
bookingSchema.pre("save", async function (next) {
  if (!this.bookingId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.bookingId = `BK${timestamp}${random}`.toUpperCase();
  }
  next();
});

// Calculate number of nights and total price
bookingSchema.pre("save", function (next) {
  if (this.isModified("checkInDate") || this.isModified("checkOutDate")) {
    const diffTime = Math.abs(this.checkOutDate - this.checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.numberOfNights = diffDays;

    if (this.pricePerNight) {
      this.totalPrice = this.pricePerNight * diffDays;
    }
  }
  next();
});

// Set expiry time for pending bookings (15 minutes)
bookingSchema.pre("save", function (next) {
  if (this.isNew && this.status === "pending") {
    this.expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  }

  // Remove expiry if confirmed
  if (this.status === "confirmed" && this.expiresAt) {
    this.expiresAt = undefined;
  }

  next();
});

// Indexes for efficient queries
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ room: 1, status: 1 });
bookingSchema.index({ checkInDate: 1, checkOutDate: 1 });
bookingSchema.index({ status: 1, paymentStatus: 1 });
bookingSchema.index({ bookingId: 1 });

// Method to check if booking is active (blocks the room)
bookingSchema.methods.isActive = function () {
  return ["pending", "confirmed", "checked-in"].includes(this.status);
};

// Method to check if cancellable
bookingSchema.methods.isCancellable = function () {
  const now = new Date();
  return this.status === "confirmed" && this.checkInDate > now;
};

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
