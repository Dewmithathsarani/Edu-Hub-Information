"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCronJobs = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const models_1 = require("../models");
// Run every hour to check for tasks due within the next 24 hours
const startCronJobs = () => {
    node_cron_1.default.schedule('0 * * * *', async () => {
        try {
            console.log('Running task reminder cron job...');
            const now = new Date();
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            // Find tasks due in the next 24 hours that are not completed
            const tasks = await models_1.Task.find({
                status: { $ne: 'completed' },
                dueDate: { $gte: now, $lte: tomorrow },
            });
            for (const task of tasks) {
                // Check if we already sent a reminder today
                const existingNotification = await models_1.Notification.findOne({
                    userId: task.userId,
                    type: 'task_reminder',
                    'metadata.taskId': task._id,
                    createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
                });
                if (!existingNotification) {
                    await models_1.Notification.create({
                        userId: task.userId,
                        type: 'task_reminder',
                        title: 'Task Due Soon',
                        message: `Your task "${task.title}" is due soon.`,
                        link: `/tasks/${task._id}`,
                        metadata: {
                            taskId: task._id
                        }
                    });
                }
            }
        }
        catch (error) {
            console.error('Error running task reminder cron job', error);
        }
    });
};
exports.startCronJobs = startCronJobs;
