"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyGroup = void 0;
const mongoose_1 = require("mongoose");
const StudyGroupSchema = new mongoose_1.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 100 },
    description: { type: String, maxlength: 500, default: '' },
    subject: { type: String, required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
            role: { type: String, enum: ['owner', 'member'], default: 'member' },
            joinedAt: { type: Date, default: Date.now }
        }],
    memberCount: { type: Number, default: 1 },
    maxMembers: { type: Number, default: 20 },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});
// Indexes
StudyGroupSchema.index({ 'members.userId': 1 });
StudyGroupSchema.index({ subject: 1, isActive: 1, memberCount: -1 });
StudyGroupSchema.index({ createdBy: 1 });
exports.StudyGroup = (0, mongoose_1.model)('StudyGroup', StudyGroupSchema);
