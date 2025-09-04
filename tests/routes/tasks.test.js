const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Task = require('../../models/Task');
const taskRoutes = require('../../routes/tasks');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/tasks', taskRoutes);

describe('Tasks API Routes', () => {
  describe('GET /api/tasks', () => {
    test('should get all tasks', async () => {
      // Create test tasks
      const task1 = new Task({ title: 'Task 1', description: 'Description 1' });
      const task2 = new Task({ title: 'Task 2', description: 'Description 2' });
      await task1.save();
      await task2.save();

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('description');
      expect(response.body[0]).toHaveProperty('completed');
    });

    test('should return empty array when no tasks exist', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/tasks/:id', () => {
    test('should get a specific task', async () => {
      const task = new Task({ title: 'Test Task', description: 'Test Description' });
      const savedTask = await task.save();

      const response = await request(app)
        .get(`/api/tasks/${savedTask._id}`)
        .expect(200);

      expect(response.body.title).toBe('Test Task');
      expect(response.body.description).toBe('Test Description');
    });

    test('should return 404 for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/tasks/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe('Task not found');
    });

    test('should return 500 for invalid task ID', async () => {
      const response = await request(app)
        .get('/api/tasks/invalid-id')
        .expect(500);

      expect(response.body.message).toBe('Error fetching task');
    });
  });

  describe('POST /api/tasks', () => {
    test('should create a new task', async () => {
      const taskData = {
        title: 'New Task',
        description: 'New Description'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.title).toBe('New Task');
      expect(response.body.description).toBe('New Description');
      expect(response.body.completed).toBe(false);
      expect(response.body._id).toBeDefined();
    });

    test('should create a task with only title', async () => {
      const taskData = {
        title: 'Task with only title'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.title).toBe('Task with only title');
      expect(response.body.description).toBe('');
    });

    test('should return 400 for missing title', async () => {
      const taskData = {
        description: 'Task without title'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.message).toBe('Title is required');
    });

    test('should return 400 for empty title', async () => {
      const taskData = {
        title: '   ',
        description: 'Task with empty title'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.message).toBe('Title is required');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    test('should update an existing task', async () => {
      const task = new Task({ title: 'Original Task', description: 'Original Description' });
      const savedTask = await task.save();

      const updateData = {
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true
      };

      const response = await request(app)
        .put(`/api/tasks/${savedTask._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe('Updated Task');
      expect(response.body.description).toBe('Updated Description');
      expect(response.body.completed).toBe(true);
    });

    test('should return 404 for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = {
        title: 'Updated Task',
        description: 'Updated Description'
      };

      const response = await request(app)
        .put(`/api/tasks/${fakeId}`)
        .send(updateData)
        .expect(404);

      expect(response.body.message).toBe('Task not found');
    });

    test('should return 400 for missing title', async () => {
      const task = new Task({ title: 'Original Task' });
      const savedTask = await task.save();

      const updateData = {
        description: 'Updated Description'
      };

      const response = await request(app)
        .put(`/api/tasks/${savedTask._id}`)
        .send(updateData)
        .expect(400);

      expect(response.body.message).toBe('Title is required');
    });
  });

  describe('PATCH /api/tasks/:id/toggle', () => {
    test('should toggle task completion status', async () => {
      const task = new Task({ title: 'Test Task', completed: false });
      const savedTask = await task.save();

      const response = await request(app)
        .patch(`/api/tasks/${savedTask._id}/toggle`)
        .expect(200);

      expect(response.body.completed).toBe(true);

      // Toggle again
      const response2 = await request(app)
        .patch(`/api/tasks/${savedTask._id}/toggle`)
        .expect(200);

      expect(response2.body.completed).toBe(false);
    });

    test('should return 404 for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .patch(`/api/tasks/${fakeId}/toggle`)
        .expect(404);

      expect(response.body.message).toBe('Task not found');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    test('should delete an existing task', async () => {
      const task = new Task({ title: 'Task to Delete' });
      const savedTask = await task.save();

      const response = await request(app)
        .delete(`/api/tasks/${savedTask._id}`)
        .expect(200);

      expect(response.body.message).toBe('Task deleted successfully');

      // Verify task is deleted
      const deletedTask = await Task.findById(savedTask._id);
      expect(deletedTask).toBeNull();
    });

    test('should return 404 for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/tasks/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe('Task not found');
    });
  });
});
