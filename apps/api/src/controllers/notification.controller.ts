import { Response } from 'express';
import { Notification } from '../models';
import { AuthRequest } from '../middleware/auth';
import { cacheService } from '../services/cache.service';

export class NotificationController {
  static async getNotifications(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const cacheKey = `notifications:${userId}`;

      const cached = await cacheService.get(cacheKey);
      if (cached) {
        res.json({ success: true, data: cached });
        return;
      }

      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50); // Get latest 50

      await cacheService.set(cacheKey, notifications, 60); // 1 min TTL

      res.json({ success: true, data: notifications });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
    }
  }

  static async markAsRead(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      const notification = await Notification.findOneAndUpdate(
        { _id: id, userId },
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        res.status(404).json({ success: false, message: 'Notification not found' });
        return;
      }

      await cacheService.invalidate(`notifications:${userId}`);

      res.json({ success: true, data: notification });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to mark as read' });
    }
  }

  static async markAllAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;

      await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
      );

      await cacheService.invalidate(`notifications:${userId}`);

      res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update notifications' });
    }
  }
}
