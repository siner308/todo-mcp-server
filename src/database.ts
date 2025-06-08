import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import { join, resolve } from "path";

export interface Todo {
  id: number;
  text: string;
}

const dataDir = "/Volumes/SHGP31-2000GM/repositories/siner308/todo-mcp-server/data";

if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Initialize database
const dbPath = join(dataDir, "todo.db");

// Connect to database
const db = Database(dbPath);

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL
  )
`);

export const dbOperations = {
  addTodo: (text: string): Todo => {
    const stmt = db.prepare("INSERT INTO todos (text) VALUES (?)");
    const info = stmt.run(text);
    return {
      id: info.lastInsertRowid as number,
      text,
    };
  },
  getTodos: (): Todo[] => {
    const stmt = db.prepare("SELECT * FROM todos ORDER BY id DESC");
    return stmt.all() as Todo[];
  },
  removeTodo: (id: number): boolean => {
    const stmt = db.prepare("DELETE FROM todos WHERE id = ?");
    const info = stmt.run(id);

    // Return true if the todo was removed, false otherwise
    return info.changes > 0;
  },
};

export default db;
