"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    password: { type: String, default: null },
    avatar: { type: String, default: '' },
    googleId: { type: String, default: null },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    isActive: { type: Boolean, default: true },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalStudyMinutes: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
    subjects: { type: [String], default: [] },
    lastLoginAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
}, {
    timestamps: true
});
// Indexes
UserSchema.index({ googleId: 1 }, { unique: true, sparse: true });
UserSchema.index({ role: 1, isActive: 1, createdAt: -1 });
UserSchema.index({ deletedAt: 1 });
exports.User = (0, mongoose_1.model)('User', UserSchema);
