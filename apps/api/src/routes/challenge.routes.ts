import { Router } from 'express';
import { ChallengeController } from '../controllers/challenge.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/active', ChallengeController.getActiveChallenges);
router.post('/', authorize('admin'), ChallengeController.createChallenge);

export const challengeRoutes = router;
