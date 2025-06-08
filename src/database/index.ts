import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { existsSync, mkdirSync } from "fs";
import { join, resolve } from "path";
import { tmpdir } from "os";
import { migrateTodosTable } from './todo/migration.js';

const dataDir = process.env.DATA_DIR
  ? resolve(process.env.DATA_DIR)
  : join(tmpdir(), "todo-mcp-server");
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}
const dbPath = join(dataDir, "todo.db");

// 비동기 DB 인스턴스 반환 함수
export async function getDb() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  await migrateTodosTable(db);
  return db;
}

export { Todo } from './todo/model.js';
export { migrateTodosTable } from './todo/migration.js';
export { addTodo } from './todo/add.js';
export { getTodos } from './todo/get.js';
export { modifyTodo } from './todo/modify.js';
export { removeTodo } from './todo/remove.js';
