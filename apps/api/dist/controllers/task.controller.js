"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const models_1 = require("../models");
const types_1 = require("@edu-hub/types");
const cache_service_1 = require("../services/cache.service");
const priorityAlgo_1 = require("../utils/priorityAlgo");
class TaskController {
    static async getTasks(req, res) {
        try {
            const { status, priority, subject, sort } = req.query;
            const userId = req.user.userId;
            const query = { userId };
            if (status)
                query.status = status;
            if (priority)
                query.priority = priority;
            if (subject)
                query.subject = subject;
            let sortOptions = { dueDate: 1 };
            if (sort === 'priority') {
                sortOptions = { priority: -1, dueDate: 1 };
            }
            // Try fetching from cache if no filters applied
            const cacheKey = `tasks:${userId}`;
            const isSimpleQuery = Object.keys(query).length === 1; // only userId
            if (isSimpleQuery) {
                const cached = await cache_service_1.cacheService.get(cacheKey);
                if (cached) {
                    res.json({ success: true, data: cached });
                    return;
                }
            }
            const tasks = await models_1.Task.find(query).sort(sortOptions);
            if (isSimpleQuery) {
                await cache_service_1.cacheService.set(cacheKey, tasks, 300); // 5 min TTL
            }
            res.json({ success: true, data: tasks });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
        }
    }
    static async getTaskById(req, res) {
        try {
            const task = await models_1.Task.findOne({ _id: req.params.id, userId: req.user.userId });
            if (!task) {
                res.status(404).json({ success: false, message: 'Task not found' });
                return;
            }
            res.json({ success: true, data: task });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    }
    static async createTask(req, res) {
        try {
            const parsed = types_1.createTaskSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.errors });
                return;
            }
            const task = await models_1.Task.create({
                ...parsed.data,
                userId: req.user.userId
            });
            await cache_service_1.cacheService.invalidate(`tasks:${req.user.userId}`);
            res.status(201).json({ success: true, data: task });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to create task' });
        }
    }
    static async updateTask(req, res) {
        try {
            const parsed = types_1.updateTaskSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.errors });
                return;
            }
            const updateData = { ...parsed.data };
            if (updateData.status === 'completed') {
                updateData.completedAt = new Date();
            }
            const task = await models_1.Task.findOneAndUpdate({ _id: req.params.id, userId: req.user.userId }, updateData, { new: true, runValidators: true });
            if (!task) {
                res.status(404).json({ success: false, message: 'Task not found' });
                return;
            }
            // Add XP if task was just marked as completed
            if (updateData.status === 'completed') {
                const { LeaderboardController } = require('./leaderboard.controller');
                await LeaderboardController.addXP(req.user.userId, 5); // 5 XP per task
            }
            await cache_service_1.cacheService.invalidate(`tasks:${req.user.userId}`);
            res.json({ success: true, data: task });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to update task' });
        }
    }
    static async deleteTask(req, res) {
        try {
            const task = await models_1.Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
            if (!task) {
                res.status(404).json({ success: false, message: 'Task not found' });
                return;
            }
            await cache_service_1.cacheService.invalidate(`tasks:${req.user.userId}`);
            res.json({ success: true, data: {} });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to delete task' });
        }
    }
    static async prioritizeTasksAI(req, res) {
        try {
            const tasks = await models_1.Task.find({ userId: req.user.userId, status: 'pending' });
            const tasksWithScores = tasks.map(task => {
                const score = (0, priorityAlgo_1.calculatePriorityScore)({
                    dueDate: task.dueDate,
                    priority: task.priority,
                    createdAt: task.createdAt
                });
                return { ...task.toObject(), priorityScore: score };
            });
            // Sort descending by score
            const sortedTasks = tasksWithScores.sort((a, b) => b.priorityScore - a.priorityScore);
            res.json({ success: true, data: sortedTasks });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to prioritize tasks' });
        }
    }
}
exports.TaskController = TaskController;
