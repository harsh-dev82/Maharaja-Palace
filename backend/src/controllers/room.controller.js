import Room from "../models/Room.js";
import RoomType from "../models/RoomType.js";

// @desc    Get all rooms (Public)
// @route   GET /api/rooms
// @access  Public
export const getRooms = async (req, res, next) => {
  try {
    const { roomType, status, floor, view } = req.query;

    // Build query
    let query = { isActive: true };

    if (roomType) query.roomType = roomType;
    if (status) query.status = status;
    if (floor) query.floor = parseInt(floor);
    if (view) query.view = view;

    const rooms = await Room.find(query)
      .populate("roomType")
      .sort({ floor: 1, roomNumber: 1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate("roomType");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create room (Admin)
// @route   POST /api/admin/rooms
// @access  Private/Admin
export const createRoom = async (req, res, next) => {
  try {
    // Verify room type exists
    const roomType = await RoomType.findById(req.body.roomType);

    if (!roomType) {
      return res.status(404).json({
        success: false,
        message: "Room type not found",
      });
    }

    const room = await Room.create(req.body);
    const populatedRoom = await Room.findById(room._id).populate("roomType");

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: populatedRoom,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room (Admin)
// @route   PUT /api/admin/rooms/:id
// @access  Private/Admin
export const updateRoom = async (req, res, next) => {
  try {
    // If updating room type, verify it exists
    if (req.body.roomType) {
      const roomType = await RoomType.findById(req.body.roomType);
      if (!roomType) {
        return res.status(404).json({
          success: false,
          message: "Room type not found",
        });
      }
    }

    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("roomType");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room (Admin)
// @route   DELETE /api/admin/rooms/:id
// @access  Private/Admin
export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Check if room has active bookings (we'll implement this in Phase 3)
    // For now, just delete

    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all rooms including inactive (Admin)
// @route   GET /api/admin/rooms
// @access  Private/Admin
export const getAllRoomsAdmin = async (req, res, next) => {
  try {
    const rooms = await Room.find()
      .populate("roomType")
      .sort({ floor: 1, roomNumber: 1 });

    // Group by status for admin dashboard
    const stats = {
      total: rooms.length,
      available: rooms.filter((r) => r.status === "available").length,
      occupied: rooms.filter((r) => r.status === "occupied").length,
      maintenance: rooms.filter((r) => r.status === "maintenance").length,
      cleaning: rooms.filter((r) => r.status === "cleaning").length,
    };

    res.status(200).json({
      success: true,
      count: rooms.length,
      stats,
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  getAllRoomsAdmin,
};
