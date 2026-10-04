import mongoose from 'mongoose';
import config from './index.js';

/**
 * Track whether MongoDB is currently connected.
 * Other modules import isMongoConnected() to decide whether
 * to query the database or fall back to in-memory data.
 */
let dbConnected = false;

mongoose.connection.on('connected', () => {
  dbConnected = true;
});

mongoose.connection.on('disconnected', () => {
  dbConnected = false;
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
  dbConnected = false;
});

/**
 * Connect to MongoDB Atlas.
 * Returns the connection on success, null on failure.
 * The server continues running either way — demo mode works without a database.
 */
const connectDB = async () => {
  if (!config.hasMongoDb()) {
    console.log('⚠️  MongoDB URI not configured. Running with in-memory data only.');
    console.log('   Set MONGODB_URI in .env to enable persistence.');
    return null;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,   // Fail fast if Atlas is unreachable
      socketTimeoutMS: 45000,           // Close sockets after 45s of inactivity
    });
    dbConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    dbConnected = false;
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.log('   Continuing without database — demo mode will still work.');
    return null;
  }
};

/**
 * Check if MongoDB is currently connected and ready for queries.
 * Used by routes to decide: query MongoDB or fall back to in-memory demoState.
 */
export function isMongoConnected() {
  return dbConnected && mongoose.connection.readyState === 1;
}

export default connectDB;
