"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const mongoose_1 = require("mongoose");
const QuizSchema = new mongoose_1.Schema({
    title: { type: String, required: true, minlength: 3, maxlength: 200 },
    description: { type: String, default: '' },
    subject: { type: String, required: true },
    lesson: { type: String, required: true },
    year: { type: Number, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    questionCount: { type: Number, default: 0 },
    timeLimit: { type: Number, default: 0 }, // 0 = no limit
    isPublished: { type: Boolean, default: false },
    totalAttempts: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});
// Indexes
QuizSchema.index({ isPublished: 1, subject: 1, createdAt: -1 });
QuizSchema.index({ subject: 1, lesson: 1, year: -1 });
QuizSchema.index({ difficulty: 1, subject: 1 });
QuizSchema.index({ createdBy: 1 });
exports.Quiz = (0, mongoose_1.model)('Quiz', QuizSchema);
