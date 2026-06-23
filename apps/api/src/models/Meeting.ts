import { Schema, model, Document, Types } from 'mongoose';

export interface IMeeting extends Document {
  title: string;
  description?: string;
  groupId?: Types.ObjectId;
  createdBy: Types.ObjectId;
  scheduledAt: Date;
  duration: number;
  zoomLink: string;
  participants: Types.ObjectId[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const MeetingSchema = new Schema<IMeeting>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  groupId: { type: Schema.Types.ObjectId, ref: 'StudyGroup', default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  zoomLink: { type: String, required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' }
}, {
  timestamps: true
});

// Indexes
MeetingSchema.index({ createdBy: 1, scheduledAt: -1 });
MeetingSchema.index({ groupId: 1, scheduledAt: -1 });
MeetingSchema.index({ scheduledAt: 1, status: 1 });

export const Meeting = model<IMeeting>('Meeting', MeetingSchema);
