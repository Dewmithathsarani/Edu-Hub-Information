import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
  userId: Types.ObjectId;
  type: 'task_reminder' | 'quiz_result' | 'group_invite' | 'challenge_complete' | 'resource_approved' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  metadata?: {
    taskId?: Types.ObjectId;
    quizId?: Types.ObjectId;
    groupId?: Types.ObjectId;
  };
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
    taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz' },
    groupId: { type: Schema.Types.ObjectId, ref: 'StudyGroup' }
  }
}, {
  timestamps: true
});

// Indexes
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // TTL index (30 days)

export const Notification = model<INotification>('Notification', NotificationSchema);
