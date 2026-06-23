import { Response } from 'express';
import { Task } from '../models';
import { AuthRequest } from '../middleware/auth';
import { createTaskSchema, updateTaskSchema } from '@edu-hub/types';
import { cacheService } from '../services/cache.service';
import { calculatePriorityScore, sortTasksByPriority } from '../utils/priorityAlgo';

export class TaskController {
  static async getTasks(req: AuthRequest, res: Response) {
    try {
      const { status, priority, subject, sort } = req.query;
      const userId = req.user!.userId;

      const query: any = { userId };
      if (status) query.status = status;
      if (priority) query.priority = priority;
      if (subject) query.subject = subject;

      let sortOptions: any = { dueDate: 1 };
      if (sort === 'priority') {
        sortOptions = { priority: -1, dueDate: 1 };
      }

      // Try fetching from cache if no filters applied
      const cacheKey = `tasks:${userId}`;
      const isSimpleQuery = Object.keys(query).length === 1; // only userId

      if (isSimpleQuery) {
        const cached = await cacheService.get(cacheKey);
        if (cached) {
          res.json({ success: true, data: cached });
          return;
        }
      }

      const tasks = await Task.find(query).sort(sortOptions);

      if (isSimpleQuery) {
        await cacheService.set(cacheKey, tasks, 300); // 5 min TTL
      }

      res.json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
    }
  }

  static async getTaskById(req: AuthRequest, res: Response) {
    try {
      const task = await Task.findOne({ _id: req.params.id, userId: req.user!.userId });
      if (!task) {
        res.status(404).json({ success: false, message: 'Task not found' });
        return;
      }
      res.json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  static async createTask(req: AuthRequest, res: Response) {
    try {
      const parsed = createTaskSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.errors });
        return;
      }

      const task = await Task.create({
        ...parsed.data,
        userId: req.user!.userId
      });

      await cacheService.invalidate(`tasks:${req.user!.userId}`);

      res.status(201).json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create task' });
    }
  }

  static async updateTask(req: AuthRequest, res: Response) {
    try {
      const parsed = updateTaskSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.errors });
        return;
      }

      const updateData = { ...parsed.data } as any;
      if (updateData.status === 'completed') {
        updateData.completedAt = new Date();
      }

      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user!.userId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!task) {
        res.status(404).json({ success: false, message: 'Task not found' });
        return;
      }

      // Add XP if task was just marked as completed
      if (updateData.status === 'completed') {
        const { LeaderboardController } = require('./leaderboard.controller');
        await LeaderboardController.addXP(req.user!.userId, 5); // 5 XP per task
      }

      await cacheService.invalidate(`tasks:${req.user!.userId}`);

      res.json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update task' });
    }
  }

  static async deleteTask(req: AuthRequest, res: Response) {
    try {
      const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user!.userId });
      
      if (!task) {
        res.status(404).json({ success: false, message: 'Task not found' });
        return;
      }

      await cacheService.invalidate(`tasks:${req.user!.userId}`);

      res.json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete task' });
    }
  }

  static async prioritizeTasksAI(req: AuthRequest, res: Response) {
    try {
      const tasks = await Task.find({ userId: req.user!.userId, status: 'pending' });
      
      const tasksWithScores = tasks.map(task => {
        const score = calculatePriorityScore({
          dueDate: task.dueDate,
          priority: task.priority as any,
          createdAt: task.createdAt
        });
        return { ...task.toObject(), priorityScore: score };
      });

      // Sort descending by score
      const sortedTasks = tasksWithScores.sort((a, b) => b.priorityScore - a.priorityScore);

      res.json({ success: true, data: sortedTasks });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to prioritize tasks' });
    }
  }
}
