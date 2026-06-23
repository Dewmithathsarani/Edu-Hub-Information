import { Request, Response } from 'express';
import { QuizAttempt, Task, StudySession } from '../models';
import { logSessionSchema } from '@edu-hub/types';

export class AnalyticsController {
  static async getDashboardStats(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      // Get user's quiz attempts
      const attempts = await QuizAttempt.find({ userId }).populate('quizId', 'subject');
      
      const quizzesTaken = attempts.length;
      let averageScore = 0;
      let strongestSubject = { name: 'N/A', score: 0 };
      let weakestSubject = { name: 'N/A', score: 0 };
      let subjectPerformance: { subject: string; score: number }[] = [];

      if (quizzesTaken > 0) {
        const totalScore = attempts.reduce((acc, curr) => acc + curr.score, 0);
        averageScore = Math.round(totalScore / quizzesTaken);

        // Group by subject
        const subjectScores: Record<string, { total: number; count: number }> = {};
        
        attempts.forEach(attempt => {
          const quiz: any = attempt.quizId;
          if (quiz && quiz.subject) {
            if (!subjectScores[quiz.subject]) {
              subjectScores[quiz.subject] = { total: 0, count: 0 };
            }
            subjectScores[quiz.subject].total += attempt.score;
            subjectScores[quiz.subject].count += 1;
          }
        });

        subjectPerformance = Object.keys(subjectScores).map(subject => ({
          subject,
          score: Math.round(subjectScores[subject].total / subjectScores[subject].count)
        }));

        if (subjectPerformance.length > 0) {
          const sorted = [...subjectPerformance].sort((a, b) => b.score - a.score);
          strongestSubject = { name: sorted[0].subject, score: sorted[0].score };
          weakestSubject = { name: sorted[sorted.length - 1].subject, score: sorted[sorted.length - 1].score };
        }
      }

      res.json({
        success: true,
        data: {
          averageScore,
          quizzesTaken,
          strongestSubject,
          weakestSubject,
          subjectPerformance
        }
      });
    } catch (error) {
      console.error('[Analytics Error]:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  static async logStudySession(req: Request, res: Response) {
    try {
      const parsed = logSessionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.errors });
      }

      const userId = (req as any).user.userId;
      const { subject, duration, startedAt, endedAt } = parsed.data;

      const session = await StudySession.create({
        userId,
        subject,
        duration,
        startedAt,
        endedAt
      });

      res.status(201).json({ success: true, data: session });
    } catch (error) {
      console.error('[Analytics Error]:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
}
