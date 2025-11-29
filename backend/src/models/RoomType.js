import mongoose from "mongoose";

const roomTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Room type name is required"],
      unique: true,
      trim: true,
      enum: {
        values: [
          "Standard",
          "Deluxe",
          "Luxury",
          "Ultra Luxury",
          "Suite",
          "Presidential Suite",
        ],
        message: "{VALUE} is not a valid room type",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    basePrice: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Price cannot be negative"],
    },
    maxOccupancy: {
      type: Number,
      required: [true, "Max occupancy is required"],
      min: [1, "Occupancy must be at least 1"],
      max: [10, "Occupancy cannot exceed 10"],
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
    size: {
      type: Number, // in square feet
      required: [true, "Room size is required"],
      min: [100, "Room size must be at least 100 sq ft"],
    },
    bedType: {
      type: String,
      enum: ["Single", "Double", "Queen", "King", "Twin"],
      default: "Queen",
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

// Index for faster queries
roomTypeSchema.index({ name: 1, isActive: 1 });

// Virtual field to get count of rooms of this type
roomTypeSchema.virtual("roomCount", {
  ref: "Room",
  localField: "_id",
  foreignField: "roomType",
  count: true,
});

// Enable virtuals in JSON
roomTypeSchema.set("toJSON", { virtuals: true });
roomTypeSchema.set("toObject", { virtuals: true });

const RoomType = mongoose.model("RoomType", roomTypeSchema);

export default RoomType;
