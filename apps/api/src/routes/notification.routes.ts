import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', NotificationController.getNotifications);
router.put('/mark-all-read', NotificationController.markAllAsRead);
router.put('/:id/read', NotificationController.markAsRead);

export default router;
