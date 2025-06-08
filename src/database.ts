import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import { join, resolve } from "path";

export interface Todo {
  id: number;
  text: string;
  priority: 'low' | 'medium' | 'high';
  type: string;
  done: boolean;
}

const dataDir = "/Volumes/SHGP31-2000GM/repositories/siner308/todo-mcp-server/data";

if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Initialize database
const dbPath = join(dataDir, "todo.db");

// Connect to database
const db = Database(dbPath);

// Create table if it doesn't exist (with priority, type, done)
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium',
    type TEXT NOT NULL DEFAULT 'general',
    done INTEGER NOT NULL DEFAULT 0
  )
`);

// Migration: add columns if missing (for legacy db)
try {
  db.prepare("ALTER TABLE todos ADD COLUMN priority TEXT NOT NULL DEFAULT 'medium'").run();
} catch (_) {}
try {
  db.prepare("ALTER TABLE todos ADD COLUMN type TEXT NOT NULL DEFAULT 'general'").run();
} catch (_) {}
try {
  db.prepare("ALTER TABLE todos ADD COLUMN done INTEGER NOT NULL DEFAULT 0").run();
} catch (_) {}

function buildSelectTodosQuery(
  priority?: 'low' | 'medium' | 'high',
  type?: string,
  done?: boolean
): { query: string, params: any[] } {
  let query = "SELECT * FROM todos";
  const conditions: string[] = [];
  const params: any[] = [];
  if (priority) {
    conditions.push("priority = ?");
    params.push(priority);
  }
  if (type) {
    conditions.push("type = ?");
    params.push(type);
  }
  if (done !== undefined) {
    conditions.push("done = ?");
    params.push(done ? 1 : 0);
  }
  if (conditions.length) {
    query += " WHERE " + conditions.join(" AND ");
  }
  query += " ORDER BY id DESC";
  return { query, params };
}

export const dbOperations = {
  addTodo: (
    text: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    type: string = 'general',
    done: boolean = false
  ): Todo => {
    const normalizedType = type.toLowerCase();
    const stmt = db.prepare("INSERT INTO todos (text, priority, type, done) VALUES (?, ?, ?, ?)");
    const info = stmt.run(text, priority, normalizedType, done ? 1 : 0);
    return {
      id: info.lastInsertRowid as number,
      text,
      priority,
      type: normalizedType,
      done,
    };
  },
  getTodos: (
    priority?: 'low' | 'medium' | 'high',
    type?: string,
    done?: boolean
  ): Todo[] => {
    const normalizedType = type ? type.toLowerCase() : undefined;
    const { query, params } = buildSelectTodosQuery(priority, normalizedType, done);
    const stmt = db.prepare(query);
    const rows = stmt.all(...params);
    return rows.map((row: any) => ({ ...row, done: !!row.done })) as Todo[];
  },
  removeTodo: (id: number): boolean => {
    const stmt = db.prepare("DELETE FROM todos WHERE id = ?");
    const info = stmt.run(id);

    // Return true if the todo was removed, false otherwise
    return info.changes > 0;
  },
  modifyTodo: (
    id: number,
    fields: { text?: string; priority?: 'low' | 'medium' | 'high'; type?: string; done?: boolean }
  ): boolean => {
    const updates: string[] = [];
    const params: any[] = [];
    if (fields.text !== undefined) {
      updates.push("text = ?");
      params.push(fields.text);
    }
    if (fields.priority !== undefined) {
      updates.push("priority = ?");
      params.push(fields.priority);
    }
    if (fields.type !== undefined) {
      updates.push("type = ?");
      params.push(fields.type.toLowerCase());
    }
    if (fields.done !== undefined) {
      updates.push("done = ?");
      params.push(fields.done ? 1 : 0);
    }
    if (updates.length === 0) return false;
    params.push(id);
    const stmt = db.prepare(`UPDATE todos SET ${updates.join(", ")} WHERE id = ?`);
    const info = stmt.run(...params);
    return info.changes > 0;
  },
  setDone: (id: number, done: boolean): boolean => {
    const stmt = db.prepare("UPDATE todos SET done = ? WHERE id = ?");
    const info = stmt.run(done ? 1 : 0, id);
    return info.changes > 0;
  },
};

export default db;
