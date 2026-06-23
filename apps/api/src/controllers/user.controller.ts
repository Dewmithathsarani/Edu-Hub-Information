import { Response } from 'express';
import { User, StudyGroup } from '../models';
import { AuthRequest } from '../middleware/auth';
import { UploadService } from '../services/upload.service';
import bcrypt from 'bcryptjs';

export class UserController {
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await User.findById(req.user!.userId).select('-password');
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const { name, subjects } = req.body;
      
      const user = await User.findById(req.user!.userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      if (name) user.name = name;
      if (subjects) user.subjects = subjects;

      await user.save();

      res.json({ success: true, data: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, subjects: user.subjects, stream: user.stream } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  static async setStream(req: AuthRequest, res: Response) {
    try {
      const { stream } = req.body;
      if (!stream) {
        res.status(400).json({ success: false, message: 'Stream is required' });
        return;
      }

      const user = await User.findById(req.user!.userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      user.stream = stream;
      await user.save();

      // Find the main stream group and add the user
      const streamGroup = await StudyGroup.findOne({ name: stream, isMainStream: true });
      if (streamGroup) {
        const isMember = streamGroup.members.some(m => m.userId.toString() === user.id);
        if (!isMember) {
          streamGroup.members.push({ userId: user.id as any, role: 'member', joinedAt: new Date() });
          streamGroup.memberCount += 1;
          await streamGroup.save();
        }
      }

      res.json({ success: true, data: { stream: user.stream } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  static async updateAvatar(req: AuthRequest, res: Response) {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'Please upload an image' });
        return;
      }

      const user = await User.findById(req.user!.userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      // Upload to Cloudinary with avatar transformation
      const result = await UploadService.uploadImage(req.file.buffer, 'edu-hub/avatars', 'w_200,h_200,c_fill,g_face');

      user.avatar = result.secure_url;
      await user.save();

      res.json({ success: true, data: { avatar: user.avatar } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Avatar upload failed' });
    }
  }

  static async changePassword(req: AuthRequest, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user!.userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      if (user.googleId && !user.password) {
        res.status(400).json({ success: false, message: 'Google authenticated users cannot change password' });
        return;
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password!);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Incorrect current password' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
}
