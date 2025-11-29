import Booking from "../models/Booking.js";
import { getAvailableRooms } from "../services/availability.service.js";
import * as bookingService from "../services/booking.service.js";

// @desc    Search available rooms
// @route   GET /api/rooms/available
// @access  Public
export const searchAvailableRooms = async (req, res, next) => {
  try {
    const { checkInDate, checkOutDate, guestsCount, roomTypeId } = req.query;

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "Check-in and check-out dates are required",
      });
    }

    const availableRooms = await getAvailableRooms(
      checkInDate,
      checkOutDate,
      parseInt(guestsCount) || 1,
      roomTypeId
    );

    res.status(200).json({
      success: true,
      count: availableRooms.length,
      data: availableRooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  try {
    const bookingData = {
      userId: req.user.id,
      ...req.body,
    };

    const booking = await bookingService.createBooking(bookingData);

    res.status(201).json({
      success: true,
      message:
        "Booking created successfully. Please complete payment within 15 minutes.",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my bookings
// @route   GET /api/bookings/me
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("room", "roomNumber floor view")
      .populate("roomType", "name basePrice amenities images")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("room", "roomNumber floor view features")
      .populate("roomType", "name basePrice amenities images");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user owns this booking or is admin
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

// @desc    Confirm booking (after payment)
// @route   PATCH /api/bookings/:id/confirm
// @access  Private
export const confirmBooking = async (req, res, next) => {
  try {
    const { paymentId, paymentMethod } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required",
      });
    }

    const booking = await bookingService.confirmBooking(req.params.id, {
      paymentId,
      paymentMethod: paymentMethod || "card",
    });

    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking",
      });
    }

    const cancelledBooking = await bookingService.cancelBooking(
      req.params.id,
      req.user.id,
      req.body.reason || "User cancelled"
    );

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: cancelledBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res, next) => {
  try {
    const { status, paymentStatus, startDate, endDate } = req.query;

    let query = {};

    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    if (startDate && endDate) {
      query.checkInDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const bookings = await Booking.find(query)
      .populate("user", "name email phone")
      .populate("room", "roomNumber floor")
      .populate("roomType", "name basePrice")
      .sort({ createdAt: -1 });

    // Calculate stats
    const stats = {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      checkedIn: bookings.filter((b) => b.status === "checked-in").length,
      checkedOut: bookings.filter((b) => b.status === "checked-out").length,
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

// @desc    Check-in guest (Admin)
// @route   PATCH /api/admin/bookings/:id/checkin
// @access  Private/Admin
export const checkInGuest = async (req, res, next) => {
  try {
    const booking = await bookingService.checkIn(req.params.id);

    res.status(200).json({
      success: true,
      message: "Guest checked in successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check-out guest (Admin)
// @route   PATCH /api/admin/bookings/:id/checkout
// @access  Private/Admin
export const checkOutGuest = async (req, res, next) => {
  try {
    const booking = await bookingService.checkOut(req.params.id);

    res.status(200).json({
      success: true,
      message: "Guest checked out successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  searchAvailableRooms,
  createBooking,
  getMyBookings,
  getBooking,
  confirmBooking,
  cancelBooking,
  getAllBookings,
  checkInGuest,
  checkOutGuest,
};
