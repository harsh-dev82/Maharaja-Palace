import BanquetHall from "../models/BanquetHall.js";
import BanquetBooking from "../models/BanquetBooking.js";

// ============= HALL MANAGEMENT =============

// @desc    Get all banquet halls (Public)
// @route   GET /api/banquet-halls
// @access  Public
export const getBanquetHalls = async (req, res, next) => {
  try {
    const { capacity, hallType, eventType } = req.query;

    let query = { isActive: true };

    if (capacity) query.capacity = { $gte: parseInt(capacity) };
    if (hallType) query.hallType = hallType;
    if (eventType) query.allowedEventTypes = eventType;

    const halls = await BanquetHall.find(query).sort({ capacity: 1 });

    res.status(200).json({
      success: true,
      count: halls.length,
      data: halls,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single banquet hall
// @route   GET /api/banquet-halls/:id
// @access  Public
export const getBanquetHall = async (req, res, next) => {
  try {
    const hall = await BanquetHall.findById(req.params.id);

    if (!hall) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    res.status(200).json({
      success: true,
      data: hall,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check hall availability
// @route   GET /api/banquet-halls/available
// @access  Public
export const checkHallAvailability = async (req, res, next) => {
  try {
    const { hallId, eventDate, startTime, endTime } = req.query;

    if (!hallId || !eventDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Hall ID, event date, start time, and end time are required",
      });
    }

    // Parse date
    const date = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return res.status(400).json({
        success: false,
        message: "Event date cannot be in the past",
      });
    }

    // Check for overlapping bookings
    const overlappingBooking = await BanquetBooking.findOne({
      hall: hallId,
      eventDate: date,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        // New booking starts during existing booking
        { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
        // New booking ends during existing booking
        { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
        // New booking spans entire existing booking
        { startTime: { $gte: startTime }, endTime: { $lte: endTime } },
      ],
    });

    const isAvailable = !overlappingBooking;

    res.status(200).json({
      success: true,
      available: isAvailable,
      message: isAvailable
        ? "Hall is available for the selected date and time"
        : "Hall is already booked for the selected date and time",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create banquet hall (Admin)
// @route   POST /api/admin/banquet-halls
// @access  Private/Admin
export const createBanquetHall = async (req, res, next) => {
  try {
    const hall = await BanquetHall.create(req.body);

    res.status(201).json({
      success: true,
      message: "Banquet hall created successfully",
      data: hall,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update banquet hall (Admin)
// @route   PUT /api/admin/banquet-halls/:id
// @access  Private/Admin
export const updateBanquetHall = async (req, res, next) => {
  try {
    const hall = await BanquetHall.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!hall) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banquet hall updated successfully",
      data: hall,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete banquet hall (Admin)
// @route   DELETE /api/admin/banquet-halls/:id
// @access  Private/Admin
export const deleteBanquetHall = async (req, res, next) => {
  try {
    const hall = await BanquetHall.findById(req.params.id);

    if (!hall) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    // Check for future bookings
    const futureBookings = await BanquetBooking.countDocuments({
      hall: req.params.id,
      eventDate: { $gte: new Date() },
      status: { $in: ["pending", "confirmed"] },
    });

    if (futureBookings > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete hall. ${futureBookings} future bookings exist.`,
      });
    }

    await hall.deleteOne();

    res.status(200).json({
      success: true,
      message: "Banquet hall deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all halls including inactive (Admin)
// @route   GET /api/admin/banquet-halls
// @access  Private/Admin
export const getAllBanquetHallsAdmin = async (req, res, next) => {
  try {
    const halls = await BanquetHall.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: halls.length,
      data: halls,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getBanquetHalls,
  getBanquetHall,
  checkHallAvailability,
  createBanquetHall,
  updateBanquetHall,
  deleteBanquetHall,
  getAllBanquetHallsAdmin,
};
