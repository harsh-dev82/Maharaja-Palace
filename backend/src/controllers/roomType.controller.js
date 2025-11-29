import RoomType from "../models/RoomType.js";
import Room from "../models/Room.js";

// @desc    Get all room types (Public)
// @route   GET /api/room-types
// @access  Public
export const getRoomTypes = async (req, res, next) => {
  try {
    const roomTypes = await RoomType.find({ isActive: true })
      .populate("roomCount")
      .sort({ basePrice: 1 });

    res.status(200).json({
      success: true,
      count: roomTypes.length,
      data: roomTypes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room type
// @route   GET /api/room-types/:id
// @access  Public
export const getRoomType = async (req, res, next) => {
  try {
    const roomType = await RoomType.findById(req.params.id);

    if (!roomType) {
      return res.status(404).json({
        success: false,
        message: "Room type not found",
      });
    }

    res.status(200).json({
      success: true,
      data: roomType,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create room type (Admin)
// @route   POST /api/admin/room-types
// @access  Private/Admin
export const createRoomType = async (req, res, next) => {
  try {
    const roomType = await RoomType.create(req.body);

    res.status(201).json({
      success: true,
      message: "Room type created successfully",
      data: roomType,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room type (Admin)
// @route   PUT /api/admin/room-types/:id
// @access  Private/Admin
export const updateRoomType = async (req, res, next) => {
  try {
    const roomType = await RoomType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!roomType) {
      return res.status(404).json({
        success: false,
        message: "Room type not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Room type updated successfully",
      data: roomType,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room type (Admin)
// @route   DELETE /api/admin/room-types/:id
// @access  Private/Admin
export const deleteRoomType = async (req, res, next) => {
  try {
    const roomType = await RoomType.findById(req.params.id);

    if (!roomType) {
      return res.status(404).json({
        success: false,
        message: "Room type not found",
      });
    }

    // Check if there are rooms using this type
    const roomsCount = await Room.countDocuments({ roomType: req.params.id });

    if (roomsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete room type. ${roomsCount} rooms are using this type. Please reassign or delete those rooms first.`,
      });
    }

    await roomType.deleteOne();

    res.status(200).json({
      success: true,
      message: "Room type deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all room types including inactive (Admin)
// @route   GET /api/admin/room-types
// @access  Private/Admin
export const getAllRoomTypesAdmin = async (req, res, next) => {
  try {
    const roomTypes = await RoomType.find()
      .populate("roomCount")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: roomTypes.length,
      data: roomTypes,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getRoomTypes,
  getRoomType,
  createRoomType,
  updateRoomType,
  deleteRoomType,
  getAllRoomTypesAdmin,
};
