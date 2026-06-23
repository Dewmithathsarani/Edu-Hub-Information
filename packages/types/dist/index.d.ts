import { z } from 'zod';
export * from 'zod';

declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
}, {
    email: string;
    password: string;
    name: string;
}>;
type LoginDTO = z.infer<typeof loginSchema>;
type RegisterDTO = z.infer<typeof registerSchema>;
interface AuthResponse {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        avatar: string;
        stream?: string;
    };
    accessToken: string;
    refreshToken: string;
}

declare const createTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    subject: z.ZodString;
    priority: z.ZodEnum<["low", "medium", "high", "urgent"]>;
    status: z.ZodOptional<z.ZodEnum<["pending", "in_progress", "completed"]>>;
    dueDate: z.ZodString;
    isExam: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title: string;
    subject: string;
    priority: "low" | "medium" | "high" | "urgent";
    dueDate: string;
    status?: "pending" | "in_progress" | "completed" | undefined;
    description?: string | undefined;
    isExam?: boolean | undefined;
}, {
    title: string;
    subject: string;
    priority: "low" | "medium" | "high" | "urgent";
    dueDate: string;
    status?: "pending" | "in_progress" | "completed" | undefined;
    description?: string | undefined;
    isExam?: boolean | undefined;
}>;
declare const updateTaskSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    subject: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodEnum<["low", "medium", "high", "urgent"]>>;
    status: z.ZodOptional<z.ZodOptional<z.ZodEnum<["pending", "in_progress", "completed"]>>>;
    dueDate: z.ZodOptional<z.ZodString>;
    isExam: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    status?: "pending" | "in_progress" | "completed" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    subject?: string | undefined;
    priority?: "low" | "medium" | "high" | "urgent" | undefined;
    dueDate?: string | undefined;
    isExam?: boolean | undefined;
}, {
    status?: "pending" | "in_progress" | "completed" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    subject?: string | undefined;
    priority?: "low" | "medium" | "high" | "urgent" | undefined;
    dueDate?: string | undefined;
    isExam?: boolean | undefined;
}>;
type CreateTaskDTO = z.infer<typeof createTaskSchema>;
type UpdateTaskDTO = z.infer<typeof updateTaskSchema>;
interface TaskResponse {
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

declare const createGroupSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    subject: z.ZodString;
    maxMembers: z.ZodOptional<z.ZodNumber>;
    isMainStream: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    subject: string;
    description?: string | undefined;
    maxMembers?: number | undefined;
    isMainStream?: boolean | undefined;
}, {
    name: string;
    subject: string;
    description?: string | undefined;
    maxMembers?: number | undefined;
    isMainStream?: boolean | undefined;
}>;
declare const createMeetingSchema: z.ZodObject<{
    groupId: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    topic: z.ZodOptional<z.ZodString>;
    scheduledFor: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    groupId?: string | undefined;
    topic?: string | undefined;
    scheduledFor?: string | undefined;
}, {
    title: string;
    groupId?: string | undefined;
    topic?: string | undefined;
    scheduledFor?: string | undefined;
}>;
declare const logSessionSchema: z.ZodObject<{
    subject: z.ZodString;
    duration: z.ZodNumber;
    startedAt: z.ZodOptional<z.ZodString>;
    endedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    subject: string;
    duration: number;
    startedAt?: string | undefined;
    endedAt?: string | undefined;
}, {
    subject: string;
    duration: number;
    startedAt?: string | undefined;
    endedAt?: string | undefined;
}>;
declare const submitQuizSchema: z.ZodObject<{
    answers: z.ZodArray<z.ZodObject<{
        questionId: z.ZodString;
        selected: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        questionId: string;
        selected?: number | null | undefined;
    }, {
        questionId: string;
        selected?: number | null | undefined;
    }>, "many">;
    timeTaken: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    answers: {
        questionId: string;
        selected?: number | null | undefined;
    }[];
    timeTaken: number;
}, {
    answers: {
        questionId: string;
        selected?: number | null | undefined;
    }[];
    timeTaken: number;
}>;

export { type AuthResponse, type CreateTaskDTO, type LoginDTO, type RegisterDTO, type TaskResponse, type UpdateTaskDTO, createGroupSchema, createMeetingSchema, createTaskSchema, logSessionSchema, loginSchema, registerSchema, submitQuizSchema, updateTaskSchema };
