import db from '../index.js';

export function removeTodo(id: number): boolean {
  const stmt = db.prepare("DELETE FROM todos WHERE id = ?");
  const info = stmt.run(id);
  return info.changes > 0;
} 