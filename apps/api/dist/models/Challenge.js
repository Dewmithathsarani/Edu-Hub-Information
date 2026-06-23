"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Challenge = void 0;
const mongoose_1 = require("mongoose");
const ChallengeSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
        type: String,
        enum: ['quiz_streak', 'study_hours', 'resource_upload', 'group_join'],
        required: true
    },
    target: { type: Number, required: true },
    reward: {
        badge: { type: String, required: true },
        xp: { type: Number, required: true }
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    participants: [{
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
            progress: { type: Number, default: 0 },
            completed: { type: Boolean, default: false },
            completedAt: { type: Date, default: null }
        }],
    participantCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});
// Indexes
ChallengeSchema.index({ isActive: 1, endDate: 1 });
ChallengeSchema.index({ 'participants.userId': 1 });
ChallengeSchema.index({ isActive: 1, participantCount: -1 });
exports.Challenge = (0, mongoose_1.model)('Challenge', ChallengeSchema);
