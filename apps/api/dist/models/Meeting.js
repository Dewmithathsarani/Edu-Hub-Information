"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meeting = void 0;
const mongoose_1 = require("mongoose");
const MeetingSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    groupId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'StudyGroup', default: null },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, required: true }, // in minutes
    zoomLink: { type: String, required: true },
    participants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' }
}, {
    timestamps: true
});
// Indexes
MeetingSchema.index({ createdBy: 1, scheduledAt: -1 });
MeetingSchema.index({ groupId: 1, scheduledAt: -1 });
MeetingSchema.index({ scheduledAt: 1, status: 1 });
exports.Meeting = (0, mongoose_1.model)('Meeting', MeetingSchema);
