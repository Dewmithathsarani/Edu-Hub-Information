"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.protect);
router.route('/')
    .get(task_controller_1.TaskController.getTasks)
    .post(task_controller_1.TaskController.createTask);
router.post('/ai-prioritize', task_controller_1.TaskController.prioritizeTasksAI);
router.route('/:id')
    .get(task_controller_1.TaskController.getTaskById)
    .put(task_controller_1.TaskController.updateTask)
    .delete(task_controller_1.TaskController.deleteTask);
exports.default = router;
