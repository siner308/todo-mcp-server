import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

const dataDir = join(__dirname, "../../data");
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}
const dbPath = join(dataDir, "todo.db");
const db = Database(dbPath);

export default db;

export { Todo } from './todo/model.js';
export { migrateTodosTable } from './todo/migration.js';
export { addTodo } from './todo/add.js';
export { getTodos } from './todo/get.js';
export { modifyTodo } from './todo/modify.js';
export { removeTodo } from './todo/remove.js'; 