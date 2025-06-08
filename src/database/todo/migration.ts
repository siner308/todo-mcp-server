import db from '../index.js';

export function migrateTodosTable() {
  db.exec(`
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
    db.prepare("ALTER TABLE todos ADD COLUMN priority TEXT NOT NULL DEFAULT 'medium'").run();
  } catch (_) {}
  try {
    db.prepare("ALTER TABLE todos ADD COLUMN type TEXT NOT NULL DEFAULT 'general'").run();
  } catch (_) {}
  try {
    db.prepare("ALTER TABLE todos ADD COLUMN done INTEGER NOT NULL DEFAULT 0").run();
  } catch (_) {}
  try {
    db.prepare("ALTER TABLE todos ADD COLUMN created_at TEXT NOT NULL DEFAULT (datetime('now'))").run();
  } catch (_) {}
  try {
    db.prepare("ALTER TABLE todos ADD COLUMN due_at TEXT").run();
  } catch (_) {}
} 