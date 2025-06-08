import { Database } from 'sqlite';

export async function migrateTodosTable(db: Database) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'medium',
      type TEXT NOT NULL DEFAULT 'general',
      done INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      due_at TEXT
    )
  `);
  try {
    await db.exec("ALTER TABLE todos ADD COLUMN priority TEXT NOT NULL DEFAULT 'medium'");
  } catch (_) {}
  try {
    await db.exec("ALTER TABLE todos ADD COLUMN type TEXT NOT NULL DEFAULT 'general'");
  } catch (_) {}
  try {
    await db.exec("ALTER TABLE todos ADD COLUMN done INTEGER NOT NULL DEFAULT 0");
  } catch (_) {}
  try {
    await db.exec("ALTER TABLE todos ADD COLUMN created_at TEXT NOT NULL DEFAULT (datetime('now'))");
  } catch (_) {}
  try {
    await db.exec("ALTER TABLE todos ADD COLUMN due_at TEXT");
  } catch (_) {}
} 