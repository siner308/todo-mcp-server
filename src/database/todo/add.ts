import db from '../index.js';
import { Todo } from './model.js';

export function addTodo(
  text: string,
  priority: 'low' | 'medium' | 'high' = 'medium',
  type: string = 'general',
  done: boolean = false,
  due_at?: string | null
): Todo {
  const normalizedType = type.toLowerCase();
  const stmt = db.prepare("INSERT INTO todos (text, priority, type, done, due_at) VALUES (?, ?, ?, ?, ?)");
  const info = stmt.run(text, priority, normalizedType, done ? 1 : 0, due_at ?? null);
  const row = db.prepare("SELECT * FROM todos WHERE id = ?").get(info.lastInsertRowid) as any;
  return {
    id: row.id,
    text: row.text,
    priority: row.priority,
    type: row.type,
    done: !!row.done,
    created_at: row.created_at,
    due_at: row.due_at,
  };
} 