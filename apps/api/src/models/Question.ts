import { Schema, model, Document, Types } from 'mongoose';

interface IOption {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface IQuestion extends Document {
  quizId: Types.ObjectId;
  questionText: string;
  image?: string;
  options: IOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  questionText: { type: String, required: true, minlength: 5, maxlength: 2000 },
  image: { type: String, default: null },
  options: [{
    label: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
    text: { type: String, required: true }
  }],
  correctAnswer: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  explanation: { type: String, default: '' },
  order: { type: Number, required: true }
}, {
  timestamps: true
});

// Indexes
QuestionSchema.index({ quizId: 1, order: 1 });

export const Question = model<IQuestion>('Question', QuestionSchema);
