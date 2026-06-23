import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  subject: z.string().min(1, 'Subject is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['pending', 'in_progress', 'completed']).optional(),
  dueDate: z.string().datetime(),
  isExam: z.boolean().optional()
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>;

export interface TaskResponse {
  id: string;
  userId: string;
  title: string;
  description: string;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: Date;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  isExam?: boolean;
}
