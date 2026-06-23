// src/index.ts
export * from "zod";

// src/user.ts
import { z } from "zod";
var loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});
var registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[0-9]/, "Password must contain at least one number")
});

// src/task.ts
import { z as z2 } from "zod";
var createTaskSchema = z2.object({
  title: z2.string().min(1, "Title is required").max(200),
  description: z2.string().max(1e3).optional(),
  subject: z2.string().min(1, "Subject is required"),
  priority: z2.enum(["low", "medium", "high", "urgent"]),
  status: z2.enum(["pending", "in_progress", "completed"]).optional(),
  dueDate: z2.string().datetime(),
  isExam: z2.boolean().optional()
});
var updateTaskSchema = createTaskSchema.partial();

// src/schemas.ts
import { z as z3 } from "zod";
var createGroupSchema = z3.object({
  name: z3.string().min(1).max(100),
  description: z3.string().max(500).optional(),
  subject: z3.string().min(1),
  maxMembers: z3.number().int().min(2).max(100).optional(),
  isMainStream: z3.boolean().optional()
});
var createMeetingSchema = z3.object({
  groupId: z3.string().optional(),
  title: z3.string().min(1).max(200),
  topic: z3.string().optional(),
  scheduledFor: z3.string().datetime().optional()
});
var logSessionSchema = z3.object({
  subject: z3.string().min(1),
  duration: z3.number().positive(),
  startedAt: z3.string().datetime().optional(),
  endedAt: z3.string().datetime().optional()
});
var submitQuizSchema = z3.object({
  answers: z3.array(z3.object({
    questionId: z3.string(),
    selected: z3.number().nullable().optional()
  })),
  timeTaken: z3.number().positive()
});
export {
  createGroupSchema,
  createMeetingSchema,
  createTaskSchema,
  logSessionSchema,
  loginSchema,
  registerSchema,
  submitQuizSchema,
  updateTaskSchema
};
