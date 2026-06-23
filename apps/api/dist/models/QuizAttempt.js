"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizAttempt = void 0;
const mongoose_1 = require("mongoose");
const QuizAttemptSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    quizId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    answers: [{
            questionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Question', required: true },
            selected: { type: String, enum: ['A', 'B', 'C', 'D', null], default: null },
            isCorrect: { type: Boolean, required: true }
        }],
    score: { type: Number, required: true },
    totalCorrect: { type: Number, required: true },
    totalWrong: { type: Number, required: true },
    totalSkipped: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    timeTaken: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
// Indexes
QuizAttemptSchema.index({ userId: 1, quizId: 1 });
QuizAttemptSchema.index({ userId: 1, completedAt: -1 });
QuizAttemptSchema.index({ quizId: 1, score: -1 });
QuizAttemptSchema.index({ userId: 1, 'answers.isCorrect': 1 });
exports.QuizAttempt = (0, mongoose_1.model)('QuizAttempt', QuizAttemptSchema);
