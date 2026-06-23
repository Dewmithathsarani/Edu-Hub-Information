"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const models_1 = require("../models");
const cache_service_1 = require("../services/cache.service");
class NotificationController {
    static async getNotifications(req, res) {
        try {
            const userId = req.user.userId;
            const cacheKey = `notifications:${userId}`;
            const cached = await cache_service_1.cacheService.get(cacheKey);
            if (cached) {
                res.json({ success: true, data: cached });
                return;
            }
            const notifications = await models_1.Notification.find({ userId })
                .sort({ createdAt: -1 })
                .limit(50); // Get latest 50
            await cache_service_1.cacheService.set(cacheKey, notifications, 60); // 1 min TTL
            res.json({ success: true, data: notifications });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
        }
    }
    static async markAsRead(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;
            const notification = await models_1.Notification.findOneAndUpdate({ _id: id, userId }, { isRead: true }, { new: true });
            if (!notification) {
                res.status(404).json({ success: false, message: 'Notification not found' });
                return;
            }
            await cache_service_1.cacheService.invalidate(`notifications:${userId}`);
            res.json({ success: true, data: notification });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to mark as read' });
        }
    }
    static async markAllAsRead(req, res) {
        try {
            const userId = req.user.userId;
            await models_1.Notification.updateMany({ userId, isRead: false }, { isRead: true });
            await cache_service_1.cacheService.invalidate(`notifications:${userId}`);
            res.json({ success: true, message: 'All notifications marked as read' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to update notifications' });
        }
    }
}
exports.NotificationController = NotificationController;
