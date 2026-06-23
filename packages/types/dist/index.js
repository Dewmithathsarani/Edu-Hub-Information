"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  createGroupSchema: () => createGroupSchema,
  createMeetingSchema: () => createMeetingSchema,
  createTaskSchema: () => createTaskSchema,
  logSessionSchema: () => logSessionSchema,
  loginSchema: () => loginSchema,
  registerSchema: () => registerSchema,
  submitQuizSchema: () => submitQuizSchema,
  updateTaskSchema: () => updateTaskSchema
});
module.exports = __toCommonJS(index_exports);
__reExport(index_exports, require("zod"), module.exports);

// src/user.ts
var import_zod = require("zod");
var loginSchema = import_zod.z.object({
  email: import_zod.z.string().email("Invalid email address"),
  password: import_zod.z.string().min(1, "Password is required")
});
var registerSchema = import_zod.z.object({
  name: import_zod.z.string().min(2, "Name must be at least 2 characters").max(50),
  email: import_zod.z.string().email("Invalid email address"),
  password: import_zod.z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[0-9]/, "Password must contain at least one number")
});

// src/task.ts
var import_zod2 = require("zod");
var createTaskSchema = import_zod2.z.object({
  title: import_zod2.z.string().min(1, "Title is required").max(200),
  description: import_zod2.z.string().max(1e3).optional(),
  subject: import_zod2.z.string().min(1, "Subject is required"),
  priority: import_zod2.z.enum(["low", "medium", "high", "urgent"]),
  status: import_zod2.z.enum(["pending", "in_progress", "completed"]).optional(),
  dueDate: import_zod2.z.string().datetime(),
  isExam: import_zod2.z.boolean().optional()
});
var updateTaskSchema = createTaskSchema.partial();

// src/schemas.ts
var import_zod3 = require("zod");
var createGroupSchema = import_zod3.z.object({
  name: import_zod3.z.string().min(1).max(100),
  description: import_zod3.z.string().max(500).optional(),
  subject: import_zod3.z.string().min(1),
  maxMembers: import_zod3.z.number().int().min(2).max(100).optional(),
  isMainStream: import_zod3.z.boolean().optional()
});
var createMeetingSchema = import_zod3.z.object({
  groupId: import_zod3.z.string().optional(),
  title: import_zod3.z.string().min(1).max(200),
  topic: import_zod3.z.string().optional(),
  scheduledFor: import_zod3.z.string().datetime().optional()
});
var logSessionSchema = import_zod3.z.object({
  subject: import_zod3.z.string().min(1),
  duration: import_zod3.z.number().positive(),
  startedAt: import_zod3.z.string().datetime().optional(),
  endedAt: import_zod3.z.string().datetime().optional()
});
var submitQuizSchema = import_zod3.z.object({
  answers: import_zod3.z.array(import_zod3.z.object({
    questionId: import_zod3.z.string(),
    selected: import_zod3.z.number().nullable().optional()
  })),
  timeTaken: import_zod3.z.number().positive()
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createGroupSchema,
  createMeetingSchema,
  createTaskSchema,
  logSessionSchema,
  loginSchema,
  registerSchema,
  submitQuizSchema,
  updateTaskSchema,
  ...require("zod")
});
