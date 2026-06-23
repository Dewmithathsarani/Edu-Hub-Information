import { Schema, model, Document, Types } from 'mongoose';

interface IParticipant {
  userId: Types.ObjectId;
  progress: number;
  completed: boolean;
  completedAt?: Date;
}

export interface IChallenge extends Document {
  title: string;
  description: string;
  type: 'quiz_streak' | 'study_hours' | 'resource_upload' | 'group_join';
  target: number;
  reward: {
    badge: string;
    xp: number;
  };
  startDate: Date;
  endDate: Date;
  participants: IParticipant[];
  participantCount: number;
  isActive: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema = new Schema<IChallenge>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['quiz_streak', 'study_hours', 'resource_upload', 'group_join'], 
    required: true 
  },
  target: { type: Number, required: true },
  reward: {
    badge: { type: String, required: true },
    xp: { type: Number, required: true }
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  participants: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null }
  }],
  participantCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

// Indexes
ChallengeSchema.index({ isActive: 1, endDate: 1 });
ChallengeSchema.index({ 'participants.userId': 1 });
ChallengeSchema.index({ isActive: 1, participantCount: -1 });

export const Challenge = model<IChallenge>('Challenge', ChallengeSchema);
