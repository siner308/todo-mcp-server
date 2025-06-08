import { getDb } from '../index.js';

export async function removeTodo(id: number): Promise<boolean> {
  const db = await getDb();
  const result = await db.run("DELETE FROM todos WHERE id = ?", id);
  return (result.changes ?? 0) > 0;
} 