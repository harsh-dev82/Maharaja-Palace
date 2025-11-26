import app from './app.js';
import connectDB from './config/db.js';
import { config } from './config/env.js';

// Connect to MongoDB
connectDB();

// Start server
const server = app.listen(config.port, () => {
  console.log(`\n🏰 Maharaja Palace Hotel Booking System`);
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 MongoDB: ${config.mongodbUri}`);
  console.log(`\n✅ Server is ready to accept requests\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
