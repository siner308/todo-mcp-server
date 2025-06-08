import db from '../index.js';
import { Todo } from './model.js';

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

export function getTodos(
  priority?: 'low' | 'medium' | 'high',
  type?: string,
  done?: boolean
): Todo[] {
  const normalizedType = type ? type.toLowerCase() : undefined;
  const { query, params } = buildSelectTodosQuery(priority, normalizedType, done);
  const stmt = db.prepare(query);
  const rows = stmt.all(...params);
  return rows.map((row: any) => ({
    id: row.id,
    text: row.text,
    priority: row.priority,
    type: row.type,
    done: !!row.done,
    created_at: row.created_at,
    due_at: row.due_at,
  })) as Todo[];
} 