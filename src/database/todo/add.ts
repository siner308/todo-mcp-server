import { getDb } from '../index.js';
import { Todo } from './model.js';

export async function addTodo(
  text: string,
  priority: 'low' | 'medium' | 'high' = 'medium',
  type: string = 'general',
  done: boolean = false,
  due_at?: string | null
): Promise<Todo> {
  const db = await getDb();
  const normalizedType = type.toLowerCase();
  const result = await db.run(
    "INSERT INTO todos (text, priority, type, done, due_at) VALUES (?, ?, ?, ?, ?)",
    text, priority, normalizedType, done ? 1 : 0, due_at ?? null
  );
  const row = await db.get("SELECT * FROM todos WHERE id = ?", result.lastID);
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