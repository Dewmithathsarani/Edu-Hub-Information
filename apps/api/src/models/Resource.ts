import { Schema, model, Document, Types } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description?: string;
  subject: string;
  type: 'notes' | 'short_notes' | 'tutorial' | 'past_paper' | 'other';
  fileUrl: string;
  filePublicId: string;
  fileType: string;
  fileSize: number;
  thumbnailUrl?: string;
  uploadedBy: Types.ObjectId;
  downloads: number;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const ResourceSchema = new Schema<IResource>({
  title: { type: String, required: true, minlength: 3, maxlength: 200 },
  description: { type: String, maxlength: 500, default: '' },
  subject: { type: String, required: true },
  type: { type: String, enum: ['notes', 'short_notes', 'tutorial', 'past_paper', 'other'], required: true },
  fileUrl: { type: String, required: true },
  filePublicId: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  thumbnailUrl: { type: String, default: null },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  downloads: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
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

export const Resource = model<IResource>('Resource', ResourceSchema);
