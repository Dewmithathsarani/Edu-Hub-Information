import { Response } from 'express';
import { Quiz, Question, QuizAttempt } from '../models';
import { AuthRequest } from '../middleware/auth';
import { cacheService } from '../services/cache.service';
import { LeaderboardController } from './leaderboard.controller';
import { submitQuizSchema } from '@edu-hub/types';

export class QuizController {
  // Get all published quizzes
  static async getQuizzes(req: AuthRequest, res: Response) {
    try {
      const { subject, difficulty, search } = req.query;
      
      const query: any = { isPublished: true };
      if (subject) query.subject = subject;
      if (difficulty) query.difficulty = difficulty;
      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }

      const cacheKey = `quizzes:${JSON.stringify(query)}`;
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        res.json({ success: true, data: cached });
        return;
      }

      const quizzes = await Quiz.find(query)
        .sort({ createdAt: -1 })
        .select('-__v');

      await cacheService.set(cacheKey, quizzes, 300); // 5 mins cache

      res.json({ success: true, data: quizzes });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch quizzes' });
    }
  }

  // Get a single quiz with its questions
  static async getQuiz(req: AuthRequest, res: Response) {
    try {
      const quizId = req.params.id;
      const cacheKey = `quiz:${quizId}:full`;

      const cached = await cacheService.get(cacheKey);
      if (cached) {
        res.json({ success: true, data: cached });
        return;
      }

      const quiz = await Quiz.findById(quizId).lean();
      if (!quiz) {
        res.status(404).json({ success: false, message: 'Quiz not found' });
        return;
      }

      const questions = await Question.find({ quizId }).sort({ order: 1 }).lean();
      
      // Strip correct answers from questions before sending to client
      const sanitizedQuestions = questions.map((q: any) => {
        const { correctAnswer, explanation, ...safeQuestion } = q;
        return safeQuestion;
      });

      const data = { ...quiz, questions: sanitizedQuestions };
      await cacheService.set(cacheKey, data, 300);

      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch quiz' });
    }
  }

  // Submit a quiz attempt
  static async submitAttempt(req: AuthRequest, res: Response) {
    try {
      const parsed = submitQuizSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.errors });
        return;
      }

      const quizId = req.params.id;
      const userId = req.user!.userId;
      const { answers, timeTaken } = parsed.data; // array of { questionId, selected }

      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        res.status(404).json({ success: false, message: 'Quiz not found' });
        return;
      }

      const questions = await Question.find({ quizId });
      
      let totalCorrect = 0;
      let totalWrong = 0;
      let totalSkipped = 0;
      const totalQuestions = questions.length;

      const processedAnswers = answers.map((ans: any) => {
        const question = questions.find(q => q._id.toString() === ans.questionId);
        if (!question) return null;

        let isCorrect = false;
        if (ans.selected === null) {
          totalSkipped++;
        } else if (ans.selected === question.correctAnswer) {
          isCorrect = true;
          totalCorrect++;
        } else {
          totalWrong++;
        }

        return {
          questionId: question._id,
          selected: ans.selected,
          isCorrect
        };
      }).filter(Boolean) as any[];

      const score = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

      const attempt = await QuizAttempt.create({
        userId,
        quizId,
        answers: processedAnswers,
        score,
        totalCorrect,
        totalWrong,
        totalSkipped,
        totalQuestions,
        timeTaken
      });

      // Update quiz stats
      quiz.totalAttempts += 1;
      quiz.averageScore = ((quiz.averageScore * (quiz.totalAttempts - 1)) + score) / quiz.totalAttempts;
      await quiz.save();

      // Add XP to user based on correct answers (10 XP per correct answer)
      const xpEarned = totalCorrect * 10;
      if (xpEarned > 0) {
        await LeaderboardController.addXP(userId, xpEarned);
      }

      // Return detailed results including explanations
      const results = questions.map(q => {
        const userAns = processedAnswers.find((a: any) => a.questionId.toString() === q._id.toString());
        return {
          questionId: q._id,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          userSelected: userAns ? userAns.selected : null,
          isCorrect: userAns ? userAns.isCorrect : false
        };
      });

      res.status(201).json({
        success: true,
        data: {
          attemptId: attempt._id,
          score,
          totalCorrect,
          totalWrong,
          totalSkipped,
          timeTaken,
          results
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to submit quiz attempt' });
    }
  }

  // Get user's past attempts
  static async getMyAttempts(req: AuthRequest, res: Response) {
    try {
      const attempts = await QuizAttempt.find({ userId: req.user!.userId })
        .sort({ completedAt: -1 })
        .populate('quizId', 'title subject difficulty');

      res.json({ success: true, data: attempts });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch attempts' });
    }
  }
}
