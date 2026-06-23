import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  subject: z.string().min(1),
  maxMembers: z.number().int().min(2).max(100).optional(),
  isMainStream: z.boolean().optional()
});

export const createMeetingSchema = z.object({
  groupId: z.string().optional(),
  title: z.string().min(1).max(200),
  topic: z.string().optional(),
  scheduledFor: z.string().datetime().optional()
});

export const logSessionSchema = z.object({
  subject: z.string().min(1),
  duration: z.number().positive(),
  startedAt: z.string().datetime().optional(),
  endedAt: z.string().datetime().optional()
});

export const submitQuizSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string(),
    selected: z.number().nullable().optional()
  })),
  timeTaken: z.number().positive()
});
