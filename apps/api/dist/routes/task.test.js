"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../index");
const models_1 = require("../models");
(0, vitest_1.describe)('Task API Integration Tests', () => {
    let accessToken = '';
    let userId = '';
    (0, vitest_1.beforeAll)(async () => {
        await models_1.User.deleteMany({});
        await models_1.Task.deleteMany({});
        // Register a user to get token
        const response = await (0, supertest_1.default)(index_1.app)
            .post('/api/v1/auth/register')
            .send({
            name: 'Task User',
            email: 'taskuser@test.com',
            password: 'Password123'
        });
        accessToken = response.body.data.accessToken;
        userId = response.body.data.user.id;
    });
    (0, vitest_1.afterAll)(async () => {
        await mongoose_1.default.connection.close();
    });
    let createdTaskId = '';
    (0, vitest_1.describe)('POST /api/v1/tasks', () => {
        (0, vitest_1.it)('should create a new task successfully', async () => {
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/api/v1/tasks')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                title: 'Test Task',
                subject: 'Physics',
                priority: 'high',
                dueDate: new Date().toISOString()
            });
            (0, vitest_1.expect)(response.status).toBe(201);
            (0, vitest_1.expect)(response.body.success).toBe(true);
            (0, vitest_1.expect)(response.body.data.title).toBe('Test Task');
            (0, vitest_1.expect)(response.body.data.userId).toBe(userId);
            createdTaskId = response.body.data._id;
        });
        (0, vitest_1.it)('should fail creation if not authenticated', async () => {
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/api/v1/tasks')
                .send({
                title: 'Test Task'
            });
            (0, vitest_1.expect)(response.status).toBe(401);
        });
    });
    (0, vitest_1.describe)('GET /api/v1/tasks', () => {
        (0, vitest_1.it)('should fetch tasks for the authenticated user', async () => {
            const response = await (0, supertest_1.default)(index_1.app)
                .get('/api/v1/tasks')
                .set('Authorization', `Bearer ${accessToken}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.success).toBe(true);
            (0, vitest_1.expect)(Array.isArray(response.body.data)).toBe(true);
            (0, vitest_1.expect)(response.body.data.length).toBe(1);
            (0, vitest_1.expect)(response.body.data[0].title).toBe('Test Task');
        });
    });
    (0, vitest_1.describe)('POST /api/v1/tasks/ai-prioritize', () => {
        (0, vitest_1.it)('should return tasks sorted by AI priority algorithm', async () => {
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/api/v1/tasks/ai-prioritize')
                .set('Authorization', `Bearer ${accessToken}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.success).toBe(true);
            (0, vitest_1.expect)(response.body.data[0].priorityScore).toBeDefined();
        });
    });
    (0, vitest_1.describe)('PUT /api/v1/tasks/:id', () => {
        (0, vitest_1.it)('should update an existing task', async () => {
            const response = await (0, supertest_1.default)(index_1.app)
                .put(`/api/v1/tasks/${createdTaskId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                status: 'completed'
            });
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.success).toBe(true);
            (0, vitest_1.expect)(response.body.data.status).toBe('completed');
        });
    });
    (0, vitest_1.describe)('DELETE /api/v1/tasks/:id', () => {
        (0, vitest_1.it)('should delete an existing task', async () => {
            const response = await (0, supertest_1.default)(index_1.app)
                .delete(`/api/v1/tasks/${createdTaskId}`)
                .set('Authorization', `Bearer ${accessToken}`);
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.success).toBe(true);
            const checkTask = await models_1.Task.findById(createdTaskId);
            (0, vitest_1.expect)(checkTask).toBeNull();
        });
    });
});
