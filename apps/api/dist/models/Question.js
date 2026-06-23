"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const mongoose_1 = require("mongoose");
const QuestionSchema = new mongoose_1.Schema({
    quizId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    questionText: { type: String, required: true, minlength: 5, maxlength: 2000 },
    image: { type: String, default: null },
    options: [{
            label: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
            text: { type: String, required: true }
        }],
    correctAnswer: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
    explanation: { type: String, default: '' },
    order: { type: Number, required: true }
}, {
    timestamps: true
});
// Indexes
QuestionSchema.index({ quizId: 1, order: 1 });
exports.Question = (0, mongoose_1.model)('Question', QuestionSchema);
