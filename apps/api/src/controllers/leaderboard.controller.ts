import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { redis } from '../config/redis';
import { User } from '../models';

export class LeaderboardController {
  // Add XP to user and update leaderboard
  static async addXP(userId: string, xpAmount: number) {
    try {
      const LEADERBOARD_KEY = 'leaderboard:global';
      
      // Update User document
      const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { xp: xpAmount } },
        { new: true }
      );

      if (user) {
        // Update Redis Sorted Set
        await redis.zadd(LEADERBOARD_KEY, user.xp, userId);
      }
    } catch (error) {
      console.error('Failed to add XP', error);
    }
  }

  // Sync MongoDB users to Redis on boot
  static async seedLeaderboard() {
    try {
      const LEADERBOARD_KEY = 'leaderboard:global';
      const users = await User.find({ xp: { $gt: 0 } }).select('xp _id').lean();
      
      if (users.length > 0) {
        const multi = redis.multi();
        users.forEach(user => {
          multi.zadd(LEADERBOARD_KEY, user.xp, user._id.toString());
        });
        await multi.exec();
        console.log(`[Leaderboard] Seeded ${users.length} users into Redis`);
      }
    } catch (error) {
      console.error('[Leaderboard] Failed to seed leaderboard:', error);
    }
  }

  static async getLeaderboard(req: AuthRequest, res: Response) {
    try {
      const LEADERBOARD_KEY = 'leaderboard:global';
      
      // Get top 50 users (ZREVRANGE gives highest score first)
      const topUsersIds = await redis.zrevrange(LEADERBOARD_KEY, 0, 49, 'WITHSCORES');
      
      // topUsersIds is an array like: ['userId1', '1500', 'userId2', '1200']
      const formattedTopUsers = [];
      const userIds = [];
      
      for (let i = 0; i < topUsersIds.length; i += 2) {
        formattedTopUsers.push({
          userId: topUsersIds[i],
          score: parseInt(topUsersIds[i + 1], 10),
        });
        userIds.push(topUsersIds[i]);
      }

      // Fetch user details from DB
      const users = await User.find({ _id: { $in: userIds } })
        .select('name avatar')
        .lean();

      const userMap = new Map(users.map(u => [u._id.toString(), u]));

      const leaderboard = formattedTopUsers.map((item, index) => ({
        rank: index + 1,
        user: userMap.get(item.userId),
        xp: item.score
      }));

      res.json({ success: true, data: leaderboard });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
    }
  }
}
