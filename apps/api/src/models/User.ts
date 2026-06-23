import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  password?: string;
  avatar: string;
  googleId?: string;
  role: 'student' | 'admin';
  isActive: boolean;
  streak: number;
  longestStreak: number;
  totalStudyMinutes: number;
  xp: number;
  badges: string[];
  subjects: string[];
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  stream?: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  password: { type: String, default: null },
  avatar: { type: String, default: '' },
  googleId: { type: String, default: null },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  isActive: { type: Boolean, default: true },
  streak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  totalStudyMinutes: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  subjects: { type: [String], default: [] },
  lastLoginAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
  stream: { type: String, default: null }
}, {
  timestamps: true
});

// Indexes
UserSchema.index({ googleId: 1 }, { unique: true, sparse: true });
UserSchema.index({ role: 1, isActive: 1, createdAt: -1 });
UserSchema.index({ deletedAt: 1 });

export const User = model<IUser>('User', UserSchema);
