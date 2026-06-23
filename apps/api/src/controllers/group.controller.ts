import { Request, Response } from 'express';
import { StudyGroup } from '../models';
import { createGroupSchema } from '@edu-hub/types';

export class GroupController {
  static async createGroup(req: Request, res: Response) {
    try {
      const parsed = createGroupSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.errors });
        return;
      }

      const { name, description, subject, maxMembers, isMainStream } = parsed.data;
      const user = (req as any).user;

      const group = await StudyGroup.create({
        name,
        description,
        subject,
        maxMembers: maxMembers || 20,
        isMainStream: user.role === 'admin' ? !!isMainStream : false,
        createdBy: user.userId,
        members: [{ userId: user.userId, role: 'owner' }],
        memberCount: 1
      });

      res.status(201).json({ success: true, data: group });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  static async getGroups(req: Request, res: Response) {
    try {
      const groups = await StudyGroup.find({ isActive: true })
        .populate('createdBy', 'name avatar')
        .sort({ createdAt: -1 });
      res.json({ success: true, data: groups });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  static async getMyGroups(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const groups = await StudyGroup.find({ 'members.userId': userId, isActive: true })
        .populate('createdBy', 'name avatar')
        .sort({ createdAt: -1 });
      res.json({ success: true, data: groups });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  static async joinGroup(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const group = await StudyGroup.findById(id);
      if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
      
      const isMember = group.members.some(m => m.userId.toString() === userId);
      if (isMember) {
        return res.status(400).json({ success: false, message: 'Already a member' });
      }

      if (group.memberCount >= group.maxMembers) {
        return res.status(400).json({ success: false, message: 'Group is full' });
      }

      group.members.push({ userId, role: 'member', joinedAt: new Date() } as any);
      group.memberCount += 1;
      await group.save();

      res.json({ success: true, data: group });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  static async leaveGroup(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const group = await StudyGroup.findById(id);
      if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

      const isOwner = group.members.some(m => m.userId.toString() === userId && m.role === 'owner');

      if (isOwner) {
        const otherMembers = group.members.filter(m => m.userId.toString() !== userId);
        if (otherMembers.length > 0) {
          // Reassign ownership to the earliest joined member
          otherMembers[0].role = 'owner';
          group.members = otherMembers;
        } else {
          // Delete group or mark inactive if no members left
          group.isActive = false;
          group.members = [];
        }
      } else {
        group.members = group.members.filter(m => m.userId.toString() !== userId);
      }

      group.memberCount = group.members.length;
      await group.save();

      res.json({ success: true, message: 'Left group successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
}
