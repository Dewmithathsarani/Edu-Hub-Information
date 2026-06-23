import { Request, Response } from 'express';
import { User, Resource, Quiz } from '../models';

export class AdminController {
  static async getDashboardStats(req: Request, res: Response) {
    try {
      const totalUsers = await User.countDocuments();
      const activeResources = await Resource.countDocuments({ status: 'approved' });
      const pendingResources = await Resource.countDocuments({ status: 'pending' });
      const totalQuizzes = await Quiz.countDocuments();

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
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  static async toggleUserStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      user.isActive = !user.isActive;
      await user.save();
      
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  static async getPendingResources(req: Request, res: Response) {
    try {
      const resources = await Resource.find({ status: 'pending' })
        .populate('uploadedBy', 'name email')
        .sort({ createdAt: 1 });
      res.json({ success: true, data: resources });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  static async updateResourceStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body; // 'approved' | 'rejected'

      const resource = await Resource.findByIdAndUpdate(
        id, 
        { status, reviewedBy: (req as any).user.userId, reviewedAt: new Date() },
        { new: true }
      );

      res.json({ success: true, data: resource });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
}
