# Taskly

A task management application with a React frontend and Node.js/Express backend connected to PostgreSQL.

## Prerequisites

- Node.js (v18+)
- PostgreSQL

## Setup

### 1. Database Setup

Create the PostgreSQL database and table:

```sql
CREATE DATABASE taskly_db;

\c taskly_db;

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  deadline DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE
);
```

### 2. Backend Setup

```bash
cd server
npm install
npm run dev
```

The server runs on `http://localhost:5001`.

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## API Endpoints

| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | `/api/tasks`        | Get all tasks            |
| POST   | `/api/tasks`        | Create a new task        |
| PATCH  | `/api/tasks/:id`    | Toggle task completion   |
| DELETE | `/api/tasks/:id`    | Delete a task            |

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Backend:** Express, Node.js
- **Database:** PostgreSQL
