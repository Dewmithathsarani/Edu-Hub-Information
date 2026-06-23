"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
let mongoServer;
const connectDB = async () => {
    try {
        let mongoURI = process.env.MONGO_URI;
        // Use memory server for local development if no URI provided
        if (!mongoURI) {
            console.log('[MongoDB]: No MONGO_URI provided, starting in-memory server...');
            mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
            mongoURI = mongoServer.getUri();
        }
        const conn = await mongoose_1.default.connect(mongoURI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log(`[MongoDB]: Connected to ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`[MongoDB Error]: ${error.message}`);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
