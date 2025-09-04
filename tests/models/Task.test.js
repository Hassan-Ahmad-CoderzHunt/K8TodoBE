const mongoose = require('mongoose');
const Task = require('../../models/Task');

describe('Task Model', () => {
  test('should create a task with valid data', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      completed: false
    };

    const task = new Task(taskData);
    const savedTask = await task.save();

    expect(savedTask._id).toBeDefined();
    expect(savedTask.title).toBe(taskData.title);
    expect(savedTask.description).toBe(taskData.description);
    expect(savedTask.completed).toBe(taskData.completed);
    expect(savedTask.createdAt).toBeDefined();
    expect(savedTask.updatedAt).toBeDefined();
  });

  test('should create a task with minimal data', async () => {
    const taskData = {
      title: 'Minimal Task'
    };

    const task = new Task(taskData);
    const savedTask = await task.save();

    expect(savedTask._id).toBeDefined();
    expect(savedTask.title).toBe(taskData.title);
    expect(savedTask.description).toBe('');
    expect(savedTask.completed).toBe(false);
  });

  test('should not create a task without title', async () => {
    const taskData = {
      description: 'Task without title'
    };

    const task = new Task(taskData);
    
    await expect(task.save()).rejects.toThrow();
  });

  test('should not create a task with empty title', async () => {
    const taskData = {
      title: '   ',
      description: 'Task with empty title'
    };

    const task = new Task(taskData);
    
    await expect(task.save()).rejects.toThrow();
  });

  test('should update updatedAt when task is modified', async () => {
    const taskData = {
      title: 'Original Task',
      description: 'Original Description'
    };

    const task = new Task(taskData);
    const savedTask = await task.save();
    const originalUpdatedAt = savedTask.updatedAt;

    // Wait a bit to ensure time difference
    await new Promise(resolve => setTimeout(resolve, 100));

    savedTask.title = 'Updated Task';
    const updatedTask = await savedTask.save();

    expect(updatedTask.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
  });

  test('should trim whitespace from title and description', async () => {
    const taskData = {
      title: '  Trimmed Title  ',
      description: '  Trimmed Description  '
    };

    const task = new Task(taskData);
    const savedTask = await task.save();

    expect(savedTask.title).toBe('Trimmed Title');
    expect(savedTask.description).toBe('Trimmed Description');
  });
});
