import { Schema, model, Document, Types } from 'mongoose';

export interface IStudySession extends Document {
  userId: Types.ObjectId;
  subject: string;
  duration: number;
  startedAt: Date;
  endedAt: Date;
  createdAt: Date;
}

const StudySessionSchema = new Schema<IStudySession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  startedAt: { type: Date, required: true },
  endedAt: { type: Date, required: true }
}, {
  timestamps: true
});

// Indexes
StudySessionSchema.index({ userId: 1, createdAt: -1 });
StudySessionSchema.index({ userId: 1, subject: 1, createdAt: -1 });
StudySessionSchema.index({ userId: 1, startedAt: 1 });

export const StudySession = model<IStudySession>('StudySession', StudySessionSchema);
