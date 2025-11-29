import BanquetBooking from "../models/BanquetBooking.js";
import BanquetHall from "../models/BanquetHall.js";

// @desc    Create banquet booking
// @route   POST /api/banquet-bookings
// @access  Private
export const createBanquetBooking = async (req, res, next) => {
  try {
    const {
      hallId,
      eventDate,
      startTime,
      endTime,
      guestsCount,
      eventType,
      specialRequests,
      cateringRequired,
      decorationRequired,
      additionalServices,
    } = req.body;

    // Get hall details
    const hall = await BanquetHall.findById(hallId);

    if (!hall) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    if (!hall.isActive) {
      return res.status(400).json({
        success: false,
        message: "Hall is not available for booking",
      });
    }

    // Validate guest count
    if (guestsCount > hall.capacity) {
      return res.status(400).json({
        success: false,
        message: `This hall can accommodate maximum ${hall.capacity} guests`,
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

    // CRITICAL: Check availability
    const overlappingBooking = await BanquetBooking.findOne({
      hall: hallId,
      eventDate: date,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
        { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
        { startTime: { $gte: startTime }, endTime: { $lte: endTime } },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({
        success: false,
        message: "Hall is not available for selected date and time",
      });
    }

    // Calculate price
    const pricePerDay = hall.basePricePerDay;
    const totalPrice = pricePerDay;

    // Generate booking ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    const bookingId = `BQ${timestamp}${random}`.toUpperCase();

    // Create booking
    const booking = await BanquetBooking.create({
      bookingId,
      user: req.user.id,
      hall: hallId,
      eventDate: date,
      startTime,
      endTime,
      guestsCount,
      eventType,
      pricePerDay,
      totalPrice,
      specialRequests,
      cateringRequired,
      decorationRequired,
      additionalServices,
      status: "pending",
      paymentStatus: "pending",
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });

    // Populate and return
    const populatedBooking = await BanquetBooking.findById(booking._id)
      .populate("user", "name email phone")
      .populate("hall");

    res.status(201).json({
      success: true,
      message:
        "Banquet booking created successfully. Please complete payment within 30 minutes.",
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my banquet bookings
// @route   GET /api/banquet-bookings/me
// @access  Private
export const getMyBanquetBookings = async (req, res, next) => {
  try {
    const bookings = await BanquetBooking.find({ user: req.user.id })
      .populate("hall")
      .sort({ eventDate: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single banquet booking
// @route   GET /api/banquet-bookings/:id
// @access  Private
export const getBanquetBooking = async (req, res, next) => {
  try {
    const booking = await BanquetBooking.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("hall");

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

// @desc    Confirm banquet booking (after payment)
// @route   PATCH /api/banquet-bookings/:id/confirm
// @access  Private
export const confirmBanquetBooking = async (req, res, next) => {
  try {
    const { paymentId, paymentMethod } = req.body;

    const booking = await BanquetBooking.findById(req.params.id);

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
    booking.paymentStatus = "paid";
    booking.paymentId = paymentId;
    booking.paymentMethod = paymentMethod || "card";
    booking.expiresAt = undefined;

    await booking.save();

    const populatedBooking = await BanquetBooking.findById(booking._id)
      .populate("user", "name email phone")
      .populate("hall");

    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel banquet booking
// @route   PATCH /api/banquet-bookings/:id/cancel
// @access  Private
export const cancelBanquetBooking = async (req, res, next) => {
  try {
    const booking = await BanquetBooking.findById(req.params.id);

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
          "Booking cannot be cancelled (must be at least 2 days before event)",
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

// @desc    Get all banquet bookings (Admin)
// @route   GET /api/admin/banquet-bookings
// @access  Private/Admin
export const getAllBanquetBookings = async (req, res, next) => {
  try {
    const { status, startDate, endDate } = req.query;

    let query = {};

    if (status) query.status = status;

    if (startDate && endDate) {
      query.eventDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const bookings = await BanquetBooking.find(query)
      .populate("user", "name email phone")
      .populate("hall", "name capacity")
      .sort({ eventDate: -1 });

    // Calculate stats
    const stats = {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
      totalRevenue: bookings
        .filter((b) => b.paymentStatus === "paid")
        .reduce((sum, b) => sum + b.totalPrice, 0),
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

export default {
  createBanquetBooking,
  getMyBanquetBookings,
  getBanquetBooking,
  confirmBanquetBooking,
  cancelBanquetBooking,
  getAllBanquetBookings,
};
