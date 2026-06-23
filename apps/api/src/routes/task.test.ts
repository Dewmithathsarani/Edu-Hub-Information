import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { app } from '../index';
import { User, Task } from '../models';

describe('Task API Integration Tests', () => {
  let accessToken = '';
  let userId = '';

  beforeAll(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});

    // Register a user to get token
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Task User',
        email: 'taskuser@test.com',
        password: 'Password123'
      });

    accessToken = response.body.data.accessToken;
    userId = response.body.data.user.id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  let createdTaskId = '';

  describe('POST /api/v1/tasks', () => {
    it('should create a new task successfully', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test Task',
          subject: 'Physics',
          priority: 'high',
          dueDate: new Date().toISOString()
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Test Task');
      expect(response.body.data.userId).toBe(userId);
      
      createdTaskId = response.body.data._id;
    });

    it('should fail creation if not authenticated', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({
          title: 'Test Task'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/tasks', () => {
    it('should fetch tasks for the authenticated user', async () => {
      const response = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].title).toBe('Test Task');
    });
  });

  describe('POST /api/v1/tasks/ai-prioritize', () => {
    it('should return tasks sorted by AI priority algorithm', async () => {
      const response = await request(app)
        .post('/api/v1/tasks/ai-prioritize')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data[0].priorityScore).toBeDefined();
    });
  });

  describe('PUT /api/v1/tasks/:id', () => {
    it('should update an existing task', async () => {
      const response = await request(app)
        .put(`/api/v1/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          status: 'completed'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('completed');
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    it('should delete an existing task', async () => {
      const response = await request(app)
        .delete(`/api/v1/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const checkTask = await Task.findById(createdTaskId);
      expect(checkTask).toBeNull();
    });
  });
});
