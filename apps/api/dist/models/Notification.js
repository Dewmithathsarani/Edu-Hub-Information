"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['task_reminder', 'quiz_result', 'group_invite', 'challenge_complete', 'resource_approved', 'system'],
        required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: null },
    metadata: {
        taskId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Task' },
        quizId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Quiz' },
        groupId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'StudyGroup' }
    }
}, {
    timestamps: true
});
// Indexes
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // TTL index (30 days)
exports.Notification = (0, mongoose_1.model)('Notification', NotificationSchema);
