import RestaurantBooking from "../models/RestaurantBooking.js";
import RestaurantTable from "../models/RestaurantTable.js";

// @desc    Create restaurant booking
// @route   POST /api/restaurant/bookings
// @access  Private
export const createRestaurantBooking = async (req, res, next) => {
  try {
    const {
      tableId,
      bookingDate,
      timeSlot,
      guestsCount,
      specialRequests,
      dietaryRestrictions,
      occasion,
      contactPhone,
    } = req.body;

    // Get table details
    const table = await RestaurantTable.findById(tableId);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    if (!table.isActive) {
      return res.status(400).json({
        success: false,
        message: "Table is not available for booking",
      });
    }

    // Validate guest count
    if (guestsCount > table.capacity) {
      return res.status(400).json({
        success: false,
        message: `This table can accommodate maximum ${table.capacity} guests`,
      });
    }

    // Parse date
    const date = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return res.status(400).json({
        success: false,
        message: "Booking date cannot be in the past",
      });
    }

    // CRITICAL: Check availability
    const existingBooking = await RestaurantBooking.findOne({
      table: tableId,
      bookingDate: date,
      timeSlot,
      status: { $in: ["pending", "confirmed", "seated"] },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "Table is not available for selected date and time slot",
      });
    }

    // Generate booking ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    const bookingId = `RT${timestamp}${random}`.toUpperCase();

    // Create booking
    const booking = await RestaurantBooking.create({
      bookingId,
      user: req.user.id,
      table: tableId,
      bookingDate: date,
      timeSlot,
      guestsCount,
      specialRequests,
      dietaryRestrictions,
      occasion,
      contactPhone,
      status: "pending",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Populate and return
    const populatedBooking = await RestaurantBooking.findById(booking._id)
      .populate("user", "name email phone")
      .populate("table");

    res.status(201).json({
      success: true,
      message:
        "Restaurant booking created successfully. Please confirm within 10 minutes.",
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my restaurant bookings
// @route   GET /api/restaurant/bookings/me
// @access  Private
export const getMyRestaurantBookings = async (req, res, next) => {
  try {
    const bookings = await RestaurantBooking.find({ user: req.user.id })
      .populate("table")
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single restaurant booking
// @route   GET /api/restaurant/bookings/:id
// @access  Private
export const getRestaurantBooking = async (req, res, next) => {
  try {
    const booking = await RestaurantBooking.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("table");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check authorization
    if (
      booking.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this booking",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm restaurant booking
// @route   PATCH /api/restaurant/bookings/:id/confirm
// @access  Private
export const confirmRestaurantBooking = async (req, res, next) => {
  try {
    const booking = await RestaurantBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be confirmed",
      });
    }

    booking.status = "confirmed";
    booking.expiresAt = undefined;

    await booking.save();

    const populatedBooking = await RestaurantBooking.findById(booking._id)
      .populate("user", "name email phone")
      .populate("table");

    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel restaurant booking
// @route   PATCH /api/restaurant/bookings/:id/cancel
// @access  Private
export const cancelRestaurantBooking = async (req, res, next) => {
  try {
    const booking = await RestaurantBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check authorization
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking",
      });
    }

    if (!booking.isCancellable()) {
      return res.status(400).json({
        success: false,
        message:
          "Booking cannot be cancelled (must be at least 2 hours before booking time)",
      });
    }

    booking.status = "cancelled";
    booking.cancellationReason = req.body.reason || "User cancelled";
    booking.cancelledAt = new Date();
    booking.cancelledBy = req.user.id;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all restaurant bookings (Admin)
// @route   GET /api/admin/restaurant/bookings
// @access  Private/Admin
export const getAllRestaurantBookings = async (req, res, next) => {
  try {
    const { status, date, timeSlot } = req.query;

    let query = {};

    if (status) query.status = status;
    if (date) query.bookingDate = new Date(date);
    if (timeSlot) query.timeSlot = timeSlot;

    const bookings = await RestaurantBooking.find(query)
      .populate("user", "name email phone")
      .populate("table", "tableNumber capacity location")
      .sort({ bookingDate: -1, timeSlot: 1 });

    // Calculate stats
    const stats = {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      seated: bookings.filter((b) => b.status === "seated").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
      noShow: bookings.filter((b) => b.status === "no-show").length,
    };

    res.status(200).json({
      success: true,
      count: bookings.length,
      stats,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark guest as seated (Admin)
// @route   PATCH /api/admin/restaurant/bookings/:id/seat
// @access  Private/Admin
export const seatGuest = async (req, res, next) => {
  try {
    const booking = await RestaurantBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Only confirmed bookings can be seated",
      });
    }

    booking.status = "seated";
    booking.actualArrivalTime = new Date();

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Guest seated successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete booking (Admin)
// @route   PATCH /api/admin/restaurant/bookings/:id/complete
// @access  Private/Admin
export const completeBooking = async (req, res, next) => {
  try {
    const booking = await RestaurantBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "seated") {
      return res.status(400).json({
        success: false,
        message: "Only seated bookings can be completed",
      });
    }

    booking.status = "completed";
    booking.actualDepartureTime = new Date();

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking completed successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createRestaurantBooking,
  getMyRestaurantBookings,
  getRestaurantBooking,
  confirmRestaurantBooking,
  cancelRestaurantBooking,
  getAllRestaurantBookings,
  seatGuest,
  completeBooking,
};
