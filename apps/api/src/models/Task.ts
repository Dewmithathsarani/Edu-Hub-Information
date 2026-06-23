import { Schema, model, Document, Types } from 'mongoose';

export interface ITask extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, maxlength: 1000, default: '' },
  subject: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], required: true },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
  dueDate: { type: Date, required: true },
  completedAt: { type: Date, default: null }
}, {
  timestamps: true
});

// Indexes
TaskSchema.index({ userId: 1, status: 1, dueDate: 1 });
TaskSchema.index({ userId: 1, priority: -1, dueDate: 1 });
TaskSchema.index({ userId: 1, completedAt: -1 });

export const Task = model<ITask>('Task', TaskSchema);
