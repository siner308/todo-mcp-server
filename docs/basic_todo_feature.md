# Personal TODO Service: Basic Feature Specification

---

## 1. Feature Definition & Purpose

- Provide a simple and efficient way for individuals to manage their daily tasks.
- Help users keep track of what needs to be done, mark completed items, and remove unnecessary tasks.
- Allow users to mark tasks as done (completed) or not done (incomplete).
- Track when each todo was created and optionally set a due date for each task.

---

## 2. Main Features

### 2.1 Add Todo
- Users can add a new todo item by entering a task description.
- Each todo is initially marked as not done (incomplete).
- The creation date is automatically set.
- Users can optionally set a due date for the todo.

### 2.2 Get Todos
- Users can view a list of all current todo items.
- The list is typically shown in reverse chronological order (most recent first).
- Users can filter the list by done status (all, done, not done).
- Each todo displays its creation date and due date (if set).

### 2.3 Remove Todo
- Users can delete a todo item by specifying its unique ID.

### 2.4 Mark as Done / Not Done
- Users can mark a todo as done (completed) or not done (incomplete).
- This can be done via a modify-todo action.

### 2.5 Set or Update Due Date
- Users can set or update the due date for a todo item.
- This can be done via a modify-todo action.

---

## 3. Data Structure Design

### 3.1 Todo Data Model (TypeScript Example)
```ts
interface Todo {
  id: number;
  text: string;
  done: boolean;
  created_at: string; // ISO8601 format
  due_at?: string | null; // ISO8601 format or null
}
```

### 3.2 DB Table Example (SQLite)
```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0, -- 0: not done, 1: done
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  due_at TEXT
);
```

---

## 4. UI/UX Flow

### 4.1 Add Todo Screen
- Text input for the task description
- Add button
- (Optional) Checkbox to mark as done on creation
- (Optional) Date picker to set a due date

### 4.2 Todo List Screen
- Display all todo items with their IDs, descriptions, done status, creation date, and due date
- Option to filter by done/not done
- Option to mark as done/not done (toggle)
- Option to set or update due date
- Option to remove a todo (e.g., delete button next to each item)

---

## 5. Example Scenarios

1. Add a todo "Read a book" (not done by default, created_at is set automatically).
2. Set a due date for "Read a book".
3. Mark "Read a book" as done.
4. Filter the list to show only done or not done tasks.
5. Remove the todo "Read a book" by its ID.

---

## 6. Reference
- This document is based on the existing project code (`src/database.ts`, `src/index.ts`), `README.md`, and common UX patterns for todo services. 