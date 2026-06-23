"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const priorityAlgo_1 = require("./priorityAlgo");
(0, vitest_1.describe)('Priority Algorithm', () => {
    (0, vitest_1.beforeEach)(() => {
        // Mock current time to a fixed date for reliable testing
        vitest_1.vi.useFakeTimers();
        vitest_1.vi.setSystemTime(new Date('2026-06-19T10:00:00Z'));
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.describe)('calculatePriorityScore', () => {
        (0, vitest_1.it)('returns 100 for overdue tasks', () => {
            const task = {
                dueDate: new Date('2026-06-18T10:00:00Z'), // 1 day ago
                priority: 'low',
                createdAt: new Date()
            };
            (0, vitest_1.expect)((0, priorityAlgo_1.calculatePriorityScore)(task)).toBe(100);
        });
        (0, vitest_1.it)('calculates higher score for closer deadlines', () => {
            const task1 = {
                dueDate: new Date('2026-06-19T12:00:00Z'), // 2 hours away
                priority: 'medium',
                createdAt: new Date()
            };
            const task2 = {
                dueDate: new Date('2026-06-20T10:00:00Z'), // 24 hours away
                priority: 'medium',
                createdAt: new Date()
            };
            const score1 = (0, priorityAlgo_1.calculatePriorityScore)(task1);
            const score2 = (0, priorityAlgo_1.calculatePriorityScore)(task2);
            (0, vitest_1.expect)(score1).toBeGreaterThan(score2);
        });
        (0, vitest_1.it)('calculates higher score for higher importance levels', () => {
            const dueDate = new Date('2026-06-20T10:00:00Z'); // 24 hours away
            const urgentTask = { dueDate, priority: 'urgent', createdAt: new Date() };
            const highTask = { dueDate, priority: 'high', createdAt: new Date() };
            const lowTask = { dueDate, priority: 'low', createdAt: new Date() };
            (0, vitest_1.expect)((0, priorityAlgo_1.calculatePriorityScore)(urgentTask)).toBeGreaterThan((0, priorityAlgo_1.calculatePriorityScore)(highTask));
            (0, vitest_1.expect)((0, priorityAlgo_1.calculatePriorityScore)(highTask)).toBeGreaterThan((0, priorityAlgo_1.calculatePriorityScore)(lowTask));
        });
    });
    (0, vitest_1.describe)('sortTasksByPriority', () => {
        (0, vitest_1.it)('sorts tasks by descending priority score', () => {
            const tasks = [
                { dueDate: new Date('2026-06-26T10:00:00Z'), priority: 'low', createdAt: new Date() }, // Far, low
                { dueDate: new Date('2026-06-19T12:00:00Z'), priority: 'urgent', createdAt: new Date() }, // Close, urgent
                { dueDate: new Date('2026-06-18T10:00:00Z'), priority: 'low', createdAt: new Date() } // Overdue
            ];
            const sorted = (0, priorityAlgo_1.sortTasksByPriority)(tasks);
            (0, vitest_1.expect)(sorted[0].priority).toBe('low'); // The overdue one
            (0, vitest_1.expect)(sorted[0].dueDate.toISOString()).toBe('2026-06-18T10:00:00.000Z');
            (0, vitest_1.expect)(sorted[1].priority).toBe('urgent');
            (0, vitest_1.expect)(sorted[2].priority).toBe('low');
        });
        (0, vitest_1.it)('uses createdAt as a tie-breaker when scores are identical', () => {
            const tasks = [
                {
                    dueDate: new Date('2026-06-20T10:00:00Z'),
                    priority: 'medium',
                    createdAt: new Date('2026-06-19T09:00:00Z') // Newer
                },
                {
                    dueDate: new Date('2026-06-20T10:00:00Z'),
                    priority: 'medium',
                    createdAt: new Date('2026-06-19T08:00:00Z') // Older
                }
            ];
            const sorted = (0, priorityAlgo_1.sortTasksByPriority)(tasks);
            // Older task should come first (smaller time value)
            (0, vitest_1.expect)(sorted[0].createdAt.toISOString()).toBe('2026-06-19T08:00:00.000Z');
        });
    });
});
