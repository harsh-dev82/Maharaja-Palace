import mongoose from "mongoose";

const banquetHallSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hall name is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Hall name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [10, "Minimum capacity is 10 guests"],
      max: [5000, "Maximum capacity is 5000 guests"],
    },
    basePricePerDay: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Price cannot be negative"],
    },
    size: {
      type: Number, // in square feet
      required: [true, "Hall size is required"],
      min: [500, "Minimum size is 500 sq ft"],
    },
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    hallType: {
      type: String,
      enum: ["Indoor", "Outdoor", "Semi-Outdoor", "Rooftop"],
      default: "Indoor",
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    floorPlan: {
      type: String, // URL to floor plan image
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    allowedEventTypes: [
      {
        type: String,
        enum: [
          "Wedding",
          "Corporate",
          "Birthday",
          "Anniversary",
          "Conference",
          "Other",
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
banquetHallSchema.index({ name: 1, isActive: 1 });
banquetHallSchema.index({ capacity: 1 });

// Virtual field to get booking count
banquetHallSchema.virtual("bookingCount", {
  ref: "BanquetBooking",
  localField: "_id",
  foreignField: "hall",
  count: true,
});

// Enable virtuals in JSON
banquetHallSchema.set("toJSON", { virtuals: true });
banquetHallSchema.set("toObject", { virtuals: true });

const BanquetHall = mongoose.model("BanquetHall", banquetHallSchema);

export default BanquetHall;
