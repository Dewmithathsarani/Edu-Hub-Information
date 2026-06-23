"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const mongoose_1 = require("mongoose");
const ResourceSchema = new mongoose_1.Schema({
    title: { type: String, required: true, minlength: 3, maxlength: 200 },
    description: { type: String, maxlength: 500, default: '' },
    subject: { type: String, required: true },
    type: { type: String, enum: ['notes', 'short_notes', 'tutorial', 'past_paper', 'other'], required: true },
    fileUrl: { type: String, required: true },
    filePublicId: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    thumbnailUrl: { type: String, default: null },
    uploadedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    downloads: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null }
}, {
    timestamps: true
});
// Indexes
ResourceSchema.index({ status: 1, subject: 1, createdAt: -1 });
ResourceSchema.index({ uploadedBy: 1, createdAt: -1 });
ResourceSchema.index({ subject: 1, type: 1, downloads: -1 });
ResourceSchema.index({ status: 1 });
exports.Resource = (0, mongoose_1.model)('Resource', ResourceSchema);
