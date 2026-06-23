import { Router } from 'express';
import { LeaderboardController } from '../controllers/leaderboard.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', LeaderboardController.getLeaderboard);

export default router;
