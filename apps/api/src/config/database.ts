import mongoose from 'mongoose';

import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGO_URI;

    // Use memory server for local development if no URI provided
    if (!mongoURI) {
      console.log('[MongoDB]: No MONGO_URI provided, starting in-memory server...');
      mongoServer = await MongoMemoryServer.create();
      mongoURI = mongoServer.getUri();
    }

    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`[MongoDB]: Connected to ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Error]: ${(error as Error).message}`);
    process.exit(1);
  }
};
