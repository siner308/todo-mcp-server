import { getDb } from '../index.js';
import { Todo } from './model.js';

export async function modifyTodo(
  id: number,
  fields: { text?: string; priority?: 'low' | 'medium' | 'high'; type?: string; done?: boolean; due_at?: string | null }
): Promise<boolean> {
  const db = await getDb();
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
  if (fields.due_at !== undefined) {
    updates.push("due_at = ?");
    params.push(fields.due_at);
  }
  if (updates.length === 0) return false;
  params.push(id);
  const result = await db.run(`UPDATE todos SET ${updates.join(", ")} WHERE id = ?`, ...params);
  return (result.changes ?? 0) > 0;
} 