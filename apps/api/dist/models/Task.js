"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const TaskSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, maxlength: 1000, default: '' },
    subject: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], required: true },
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
    dueDate: { type: Date, required: true },
    completedAt: { type: Date, default: null },
    isExam: { type: Boolean, default: false }
}, {
    timestamps: true
});
// Indexes
TaskSchema.index({ userId: 1, status: 1, dueDate: 1 });
TaskSchema.index({ userId: 1, priority: -1, dueDate: 1 });
TaskSchema.index({ userId: 1, completedAt: -1 });
exports.Task = (0, mongoose_1.model)('Task', TaskSchema);
