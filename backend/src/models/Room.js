import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    roomType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: [true, "Room type is required"],
    },
    floor: {
      type: Number,
      required: [true, "Floor number is required"],
      min: [0, "Floor cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: ["available", "occupied", "maintenance", "cleaning"],
        message: "{VALUE} is not a valid status",
      },
      default: "available",
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    view: {
      type: String,
      enum: [
        "City View",
        "Garden View",
        "Pool View",
        "Mountain View",
        "No View",
      ],
      default: "No View",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastMaintenanceDate: {
      type: Date,
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

// Compound index for efficient queries
roomSchema.index({ roomType: 1, status: 1, isActive: 1 });
roomSchema.index({ roomNumber: 1 });

// Pre-save middleware to validate room type exists
roomSchema.pre("save", async function (next) {
  if (this.isModified("roomType")) {
    const RoomType = mongoose.model("RoomType");
    const roomType = await RoomType.findById(this.roomType);

    if (!roomType) {
      next(new Error("Invalid room type"));
    }
  }
  next();
});

// Method to check if room is bookable
roomSchema.methods.isBookable = function () {
  return this.status === "available" && this.isActive;
};

const Room = mongoose.model("Room", roomSchema);

export default Room;
