import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculatePriorityScore, sortTasksByPriority, TaskPriorityInput } from './priorityAlgo';

describe('Priority Algorithm', () => {
  beforeEach(() => {
    // Mock current time to a fixed date for reliable testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-19T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('calculatePriorityScore', () => {
    it('returns 100 for overdue tasks', () => {
      const task: TaskPriorityInput = {
        dueDate: new Date('2026-06-18T10:00:00Z'), // 1 day ago
        priority: 'low',
        createdAt: new Date()
      };
      expect(calculatePriorityScore(task)).toBe(100);
    });

    it('calculates higher score for closer deadlines', () => {
      const task1: TaskPriorityInput = {
        dueDate: new Date('2026-06-19T12:00:00Z'), // 2 hours away
        priority: 'medium',
        createdAt: new Date()
      };
      const task2: TaskPriorityInput = {
        dueDate: new Date('2026-06-20T10:00:00Z'), // 24 hours away
        priority: 'medium',
        createdAt: new Date()
      };
      
      const score1 = calculatePriorityScore(task1);
      const score2 = calculatePriorityScore(task2);
      
      expect(score1).toBeGreaterThan(score2);
    });

    it('calculates higher score for higher importance levels', () => {
      const dueDate = new Date('2026-06-20T10:00:00Z'); // 24 hours away
      
      const urgentTask: TaskPriorityInput = { dueDate, priority: 'urgent', createdAt: new Date() };
      const highTask: TaskPriorityInput = { dueDate, priority: 'high', createdAt: new Date() };
      const lowTask: TaskPriorityInput = { dueDate, priority: 'low', createdAt: new Date() };
      
      expect(calculatePriorityScore(urgentTask)).toBeGreaterThan(calculatePriorityScore(highTask));
      expect(calculatePriorityScore(highTask)).toBeGreaterThan(calculatePriorityScore(lowTask));
    });
  });

  describe('sortTasksByPriority', () => {
    it('sorts tasks by descending priority score', () => {
      const tasks: TaskPriorityInput[] = [
        { dueDate: new Date('2026-06-26T10:00:00Z'), priority: 'low', createdAt: new Date() }, // Far, low
        { dueDate: new Date('2026-06-19T12:00:00Z'), priority: 'urgent', createdAt: new Date() }, // Close, urgent
        { dueDate: new Date('2026-06-18T10:00:00Z'), priority: 'low', createdAt: new Date() } // Overdue
      ];

      const sorted = sortTasksByPriority(tasks);
      
      expect(sorted[0].priority).toBe('low'); // The overdue one
      expect(sorted[0].dueDate.toISOString()).toBe('2026-06-18T10:00:00.000Z');
      expect(sorted[1].priority).toBe('urgent');
      expect(sorted[2].priority).toBe('low');
    });

    it('uses createdAt as a tie-breaker when scores are identical', () => {
      const tasks: TaskPriorityInput[] = [
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

      const sorted = sortTasksByPriority(tasks);
      
      // Older task should come first (smaller time value)
      expect(sorted[0].createdAt.toISOString()).toBe('2026-06-19T08:00:00.000Z');
    });
  });
});
