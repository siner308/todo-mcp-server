# Personal TODO Service: Basic Feature Specification

---

## 1. Feature Definition & Purpose

- Provide a simple and efficient way for individuals to manage their daily tasks.
- Help users keep track of what needs to be done, mark completed items, and remove unnecessary tasks.
- Allow users to mark tasks as done (completed) or not done (incomplete).

---

## 2. Main Features

### 2.1 Add Todo
- Users can add a new todo item by entering a task description.
- Each todo is initially marked as not done (incomplete).

### 2.2 Get Todos
- Users can view a list of all current todo items.
- The list is typically shown in reverse chronological order (most recent first).
- Users can filter the list by done status (all, done, not done).

### 2.3 Remove Todo
- Users can delete a todo item by specifying its unique ID.

### 2.4 Mark as Done / Not Done
- Users can mark a todo as done (completed) or not done (incomplete).
- This can be done via a modify-todo action.

---

## 3. Data Structure Design

### 3.1 Todo Data Model (TypeScript Example)
```ts
interface Todo {
  id: number;
  text: string;
  done: boolean;
}
```

### 3.2 DB Table Example (SQLite)
```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0 -- 0: not done, 1: done
);
```

---

## 4. UI/UX Flow

### 4.1 Add Todo Screen
- Text input for the task description
- Add button
- (Optional) Checkbox to mark as done on creation

### 4.2 Todo List Screen
- Display all todo items with their IDs, descriptions, and done status
- Option to filter by done/not done
- Option to mark as done/not done (toggle)
- Option to remove a todo (e.g., delete button next to each item)

---

## 5. Example Scenarios

1. Add a todo "Read a book" (not done by default).
2. Mark "Read a book" as done.
3. Filter the list to show only done or not done tasks.
4. Remove the todo "Read a book" by its ID.

---

## 6. Reference
- This document is based on the existing project code (`src/database.ts`, `src/index.ts`), `README.md`, and common UX patterns for todo services. 