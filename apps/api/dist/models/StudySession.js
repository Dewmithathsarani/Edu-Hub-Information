"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudySession = void 0;
const mongoose_1 = require("mongoose");
const StudySessionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    startedAt: { type: Date, required: true },
    endedAt: { type: Date, required: true }
}, {
    timestamps: true
});
// Indexes
StudySessionSchema.index({ userId: 1, createdAt: -1 });
StudySessionSchema.index({ userId: 1, subject: 1, createdAt: -1 });
StudySessionSchema.index({ userId: 1, startedAt: 1 });
exports.StudySession = (0, mongoose_1.model)('StudySession', StudySessionSchema);
