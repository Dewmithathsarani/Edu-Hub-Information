"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const models_1 = require("../models");
class AdminController {
    static async getDashboardStats(req, res) {
        try {
            const totalUsers = await models_1.User.countDocuments();
            const activeResources = await models_1.Resource.countDocuments({ status: 'approved' });
            const pendingResources = await models_1.Resource.countDocuments({ status: 'pending' });
            const totalQuizzes = await models_1.Quiz.countDocuments();
            res.json({
                success: true,
                data: {
                    totalUsers,
                    activeResources,
                    pendingResources,
                    totalQuizzes,
                    revenue: 0
                }
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    }
    static async getUsers(req, res) {
        try {
            const users = await models_1.User.find().select('-password').sort({ createdAt: -1 });
            res.json({ success: true, data: users });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    }
    static async toggleUserStatus(req, res) {
        try {
            const { id } = req.params;
            const user = await models_1.User.findById(id);
            if (!user)
                return res.status(404).json({ success: false, message: 'User not found' });
            user.isActive = !user.isActive;
            await user.save();
            res.json({ success: true, data: user });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    }
    static async getPendingResources(req, res) {
        try {
            const resources = await models_1.Resource.find({ status: 'pending' })
                .populate('uploadedBy', 'name email')
                .sort({ createdAt: 1 });
            res.json({ success: true, data: resources });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    }
    static async updateResourceStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body; // 'approved' | 'rejected'
            const resource = await models_1.Resource.findByIdAndUpdate(id, { status, reviewedBy: req.user.userId, reviewedAt: new Date() }, { new: true });
            res.json({ success: true, data: resource });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    }
}
exports.AdminController = AdminController;
