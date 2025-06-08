#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from "zod";
import * as dbOperations from "./database/index.js";

const server = new McpServer({
  name: "TODO",
  version: "1.0.0",
  prompt: `You are a personal todo assistant.
When a user adds a todo item and does not specify the type, infer the most appropriate type from the todo's text and assign it automatically.
For example:
- If the text is about eating or coffee, set type to "meal".
- If it's about studying, set type to "study".
- If it's about work, set type to "work".
- If it's about a meeting or appointment, set type to "meeting".
- If you cannot infer, use "general".

Always provide clear, concise, and helpful responses.
Support adding, modifying, removing, and listing todos, including priority, type, due date, and completion status.`
});

// Add Tools
server.tool(
  "add-todo",
  {
    text: z.string(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    type: z.string().optional(),
    done: z.boolean().optional(),
    due_at: z.string().optional(),
  },
  {
    description: `Adds a new todo item.
- If type is not specified, it will be inferred from the text (see below).
- You can set priority ("low", "medium", "high"), due date (ISO8601 string), and done status (default: false).
- If you do not specify a due date, it will be unset.
- If you do not specify priority, it will default to "medium".

When a user adds a todo item and does not specify the type, infer the most appropriate type from the todo's text and assign it automatically. For example, if the text is about eating or coffee, set type to "meal"; if it's about studying, set type to "study"; if it's about work, set type to "work"; if it's about a meeting or appointment, set type to "meeting". If you cannot infer, use "general".`
  },
  async ({text, priority = 'medium', type = 'general', done = false, due_at}) => {
    const todo = await dbOperations.addTodo(text, priority, type, done, due_at);
    return {
      content: [
        {
          type: "text",
          text: `${text} (priority: ${priority}, type: ${type}, done: ${done}, due_at: ${due_at ?? '없음'}) was added to our todo with ID ${todo.id}`
        }
      ]
    }
  }
)

server.tool(
  "get-todos",
  {
    priority: z.enum(['low', 'medium', 'high']).optional(),
    type: z.string().optional(),
    done: z.boolean().optional(),
  },
  {
    description: `Returns a list of todo items, sorted by id in descending order (most recent first).
- You can filter by priority ("low", "medium", "high"), type (string), and done status (true/false).
- Each todo includes id, text, priority, type, done, created_at, and due_at fields.`
  },
  async ({ priority, type, done }) => {
    const todos = await dbOperations.getTodos(priority, type, done);
    if (todos.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "You have not To Do items yet"
          }
        ]
      }
    }
    const todoList = todos.map((todo) => `${todo.id}: ${todo.text} [priority: ${todo.priority}, type: ${todo.type}, done: ${todo.done}]`).join("\n");
    return {
      content: [
        {
          type: "text",
          text: `You have ${todos.length} To Do items: \n ${todoList}`,
        }
      ]
    }
  }
)

server.tool(
  "remove-todo",
  {
    id: z.number(),
  },
  {
    description: `Removes a todo item by its id.
- Returns a success message if the todo was found and removed, or an error message if not found.`
  },
  async ({id}) => {
    const success = await dbOperations.removeTodo(id);

    if (!success) {
      return {
        content: [
          {
            type: "text",
            text: `Error: Todo ${id} was not found`
          }
        ]
      }
    }

    return {
      content: [
        {
          type: "text",
          text: `Todo ${id} was removed`
        }
      ]
    }
  }
)

server.tool(
  "modify-todo",
  {
    id: z.number(),
    text: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    type: z.string().optional(),
    done: z.boolean().optional(),
    due_at: z.string().optional(),
  },
  {
    description: `Modifies an existing todo item by id.
- You can update text, priority, type, done status, and due date (due_at).
- Returns a success message if the todo was found and updated, or an error message if not found or no fields to update.`
  },
  async ({ id, text, priority, type, done, due_at }) => {
    const success = await dbOperations.modifyTodo(id, { text, priority, type, done, due_at });
    if (!success) {
      return {
        content: [
          {
            type: "text",
            text: `Error: Todo ${id} was not found or no fields to update.`
          }
        ]
      }
    }
    return {
      content: [
        {
          type: "text",
          text: `Todo ${id} was updated.${due_at ? ` (due_at: ${due_at})` : ''}`
        }
      ]
    }
  }
)

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});