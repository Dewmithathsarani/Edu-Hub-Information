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
(0, vitest_1.describe)('Auth API Integration Tests', () => {
    (0, vitest_1.beforeAll)(async () => {
        // Note: The database connection is handled by the MongoMemoryServer in database.ts
        // We just clear the users collection before tests
        await models_1.User.deleteMany({});
    });
    (0, vitest_1.afterAll)(async () => {
        await mongoose_1.default.connection.close();
    });
    const testUser = {
        name: 'Test Student',
        email: 'test@student.com',
        password: 'Password123'
    };
    (0, vitest_1.describe)('POST /api/v1/auth/register', () => {
        (0, vitest_1.it)('should register a new user successfully', async () => {
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/api/v1/auth/register')
                .send(testUser);
            (0, vitest_1.expect)(response.status).toBe(201);
            (0, vitest_1.expect)(response.body.success).toBe(true);
            (0, vitest_1.expect)(response.body.data.user.email).toBe(testUser.email);
            (0, vitest_1.expect)(response.body.data.accessToken).toBeDefined();
        });
        (0, vitest_1.it)('should fail when registering an existing email', async () => {
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/api/v1/auth/register')
                .send(testUser);
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.success).toBe(false);
            (0, vitest_1.expect)(response.body.message).toBe('User already exists');
        });
        (0, vitest_1.it)('should fail validation with missing fields', async () => {
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/api/v1/auth/register')
                .send({ email: 'bad@email.com' });
            (0, vitest_1.expect)(response.status).toBe(400);
            (0, vitest_1.expect)(response.body.success).toBe(false);
        });
    });
    (0, vitest_1.describe)('POST /api/v1/auth/login', () => {
        (0, vitest_1.it)('should login successfully with correct credentials', async () => {
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/api/v1/auth/login')
                .send({
                email: testUser.email,
                password: testUser.password
            });
            (0, vitest_1.expect)(response.status).toBe(200);
            (0, vitest_1.expect)(response.body.success).toBe(true);
            (0, vitest_1.expect)(response.body.data.accessToken).toBeDefined();
        });
        (0, vitest_1.it)('should fail login with incorrect password', async () => {
            const response = await (0, supertest_1.default)(index_1.app)
                .post('/api/v1/auth/login')
                .send({
                email: testUser.email,
                password: 'wrongpassword'
            });
            (0, vitest_1.expect)(response.status).toBe(401);
            (0, vitest_1.expect)(response.body.success).toBe(false);
            (0, vitest_1.expect)(response.body.message).toBe('Invalid credentials');
        });
    });
});
