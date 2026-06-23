import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/dashboard', AnalyticsController.getDashboardStats);
router.post('/sessions', AnalyticsController.logStudySession);

export const analyticsRoutes = router;
