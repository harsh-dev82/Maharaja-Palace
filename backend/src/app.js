import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import errorHandler from "./middleware/errorHandler.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import roomTypeRoutes from "./routes/roomType.routes.js";
import roomRoutes, { adminRoomRoutes } from "./routes/room.routes.js";
import bookingRoutes, { adminBookingRoutes } from "./routes/booking.routes.js";
import {
  banquetHallRoutes,
  adminBanquetHallRoutes,
  banquetBookingRoutes,
  adminBanquetBookingRoutes,
} from "./routes/banquet.routes.js";
import {
  restaurantTableRoutes,
  adminRestaurantTableRoutes,
  restaurantBookingRoutes,
  adminRestaurantBookingRoutes,
} from "./routes/restaurant.routes.js";

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

app.use("/api", limiter);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/room-types", roomTypeRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/admin/rooms", adminRoomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin/bookings", adminBookingRoutes);
app.use("/api/banquet-halls", banquetHallRoutes);
app.use("/api/admin/banquet-halls", adminBanquetHallRoutes);
app.use("/api/banquet-bookings", banquetBookingRoutes);
app.use("/api/admin/banquet-bookings", adminBanquetBookingRoutes);
app.use("/api/restaurant/tables", restaurantTableRoutes);
app.use("/api/admin/restaurant/tables", adminRestaurantTableRoutes);
app.use("/api/restaurant/bookings", restaurantBookingRoutes);
app.use("/api/admin/restaurant/bookings", adminRestaurantBookingRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
