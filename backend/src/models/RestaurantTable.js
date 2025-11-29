import mongoose from "mongoose";

const restaurantTableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: [true, "Table number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    capacity: {
      type: Number,
      required: [true, "Table capacity is required"],
      min: [1, "Minimum capacity is 1"],
      max: [20, "Maximum capacity is 20"],
    },
    location: {
      type: String,
      enum: {
        values: [
          "Indoor",
          "Outdoor",
          "VIP",
          "Terrace",
          "Poolside",
          "Private Room",
        ],
        message: "{VALUE} is not a valid location",
      },
      required: [true, "Location is required"],
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
restaurantTableSchema.index({ tableNumber: 1 });
restaurantTableSchema.index({ capacity: 1, location: 1 });
restaurantTableSchema.index({ isActive: 1 });

// Virtual field to get booking count
restaurantTableSchema.virtual("bookingCount", {
  ref: "RestaurantBooking",
  localField: "_id",
  foreignField: "table",
  count: true,
});

// Enable virtuals in JSON
restaurantTableSchema.set("toJSON", { virtuals: true });
restaurantTableSchema.set("toObject", { virtuals: true });

const RestaurantTable = mongoose.model(
  "RestaurantTable",
  restaurantTableSchema
);

export default RestaurantTable;
