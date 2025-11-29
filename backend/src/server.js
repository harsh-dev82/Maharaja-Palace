import app from "./app.js";
import connectDB from "./config/db.js";
import config from "./config/env.js";

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Connect to database
connectDB();

// Start server
const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log("");
  console.log("🏰 ====================================");
  console.log("   MAHARAJA PALACE API SERVER");
  console.log("====================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${config.nodeEnv}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
  console.log("====================================");
  console.log("");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
