import { Schema, model, Document, Types } from 'mongoose';

interface IMember {
  userId: Types.ObjectId;
  role: 'owner' | 'member';
  joinedAt: Date;
}

export interface IStudyGroup extends Document {
  name: string;
  description?: string;
  subject: string;
  createdBy: Types.ObjectId;
  members: IMember[];
  memberCount: number;
  maxMembers: number;
  isActive: boolean;
  isMainStream: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StudyGroupSchema = new Schema<IStudyGroup>({
  name: { type: String, required: true, minlength: 3, maxlength: 100 },
  description: { type: String, maxlength: 500, default: '' },
  subject: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['owner', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  memberCount: { type: Number, default: 1 },
  maxMembers: { type: Number, default: 20 },
  isActive: { type: Boolean, default: true },
  isMainStream: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes
StudyGroupSchema.index({ 'members.userId': 1 });
StudyGroupSchema.index({ subject: 1, isActive: 1, memberCount: -1 });
StudyGroupSchema.index({ createdBy: 1 });

export const StudyGroup = model<IStudyGroup>('StudyGroup', StudyGroupSchema);
