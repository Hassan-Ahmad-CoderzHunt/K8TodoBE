# K8 Todo Backend

A Node.js/Express backend for the K8 Todo application with MongoDB integration.

## Features

- RESTful API for task management
- MongoDB integration with Mongoose
- CRUD operations for tasks
- Task completion toggle
- Input validation
- Error handling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running on your local machine

3. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion
- `DELETE /api/tasks/:id` - Delete a task

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/TodoListDb/TodoList
NODE_ENV=development
```

## Database

The application uses MongoDB with a collection named `K8TaskList` to store task data.
