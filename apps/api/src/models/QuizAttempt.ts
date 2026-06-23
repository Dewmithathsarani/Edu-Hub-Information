import { Schema, model, Document, Types } from 'mongoose';

interface IAnswer {
  questionId: Types.ObjectId;
  selected: 'A' | 'B' | 'C' | 'D' | null;
  isCorrect: boolean;
}

export interface IQuizAttempt extends Document {
  userId: Types.ObjectId;
  quizId: Types.ObjectId;
  answers: IAnswer[];
  score: number;
  totalCorrect: number;
  totalWrong: number;
  totalSkipped: number;
  totalQuestions: number;
  timeTaken: number;
  completedAt: Date;
  createdAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [{
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    selected: { type: String, enum: ['A', 'B', 'C', 'D', null], default: null },
    isCorrect: { type: Boolean, required: true }
  }],
  score: { type: Number, required: true },
  totalCorrect: { type: Number, required: true },
  totalWrong: { type: Number, required: true },
  totalSkipped: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes
QuizAttemptSchema.index({ userId: 1, quizId: 1 });
QuizAttemptSchema.index({ userId: 1, completedAt: -1 });
QuizAttemptSchema.index({ quizId: 1, score: -1 });
QuizAttemptSchema.index({ userId: 1, 'answers.isCorrect': 1 });

export const QuizAttempt = model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
