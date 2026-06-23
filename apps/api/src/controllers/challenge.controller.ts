import { Request, Response } from 'express';
import { Challenge } from '../models';

export class ChallengeController {
  static async getActiveChallenges(req: Request, res: Response) {
    try {
      const challenges = await Challenge.find({ isActive: true });
      res.json({ success: true, data: challenges });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  static async createChallenge(req: Request, res: Response) {
    try {
      const { title, description, type, targetValue, rewardBadge } = req.body;
      const challenge = await Challenge.create({
        title, description, type, target: targetValue, reward: { badge: rewardBadge, xp: 100 },
        startDate: new Date(), endDate: new Date(Date.now() + 86400000 * 7), createdBy: (req as any).user.userId
      });
      res.status(201).json({ success: true, data: challenge });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
}
