#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from "zod";
import * as dbOperations from "./database/index.js";

const server = new McpServer({
  name: "TODO",
  version: "1.0.0",
  prompt: `
    사용자가 할 일을 추가할 때 type을 명시하지 않으면, 텍스트를 보고 가장 적절한 type을 추론해서 자동으로 할당하세요.
    예를 들어, 밥/식사/먹기 관련이면 type을 "meal", 공부/학습/시험 관련이면 "study", 업무/회의/보고 관련이면 "work"로 하세요.
    판단이 어려우면 "general"을 사용하세요.

    When a user adds a todo item and does not specify the type, infer the most appropriate type from the todo's text and assign it automatically.
    For example, if the text is about eating, set type to "meal"; if it's about studying, set type to "study"; if it's about work, set type to "work".
    If you cannot infer, use "general".
  `
});

// Add Tools
server.tool(
  "add-todo",
  {
    text: z.string(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    type: z.string().optional(),
    done: z.boolean().optional(),
  },
  async ({text, priority = 'medium', type = 'general', done = false}) => {
    const todo = dbOperations.addTodo(text, priority, type, done);
    return {
      content: [
        {
          type: "text",
          text: `${text} (priority: ${priority}, type: ${type}, done: ${done}) was added to our todo with ID ${todo.id}`
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
    description: `할 일 목록은 id 내림차순(최신순)으로 정렬되어 반환됩니다. id 순서는 생성일(created_at) 순서와 동일합니다. id가 작을수록 오래된 할 일, id가 클수록 최근 할 일입니다.\n\nThe todo list is returned in descending order of id (most recent first). The order of ids is the same as the order of creation (created_at). A smaller id means an older todo, and a larger id means a more recent todo.`
  },
  async ({ priority, type, done }) => {
    const todos = dbOperations.getTodos(priority, type, done);
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
  async ({id}) => {
    const success = dbOperations.removeTodo(id);

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
  },
  async ({ id, text, priority, type, done }) => {
    const success = dbOperations.modifyTodo(id, { text, priority, type, done });
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
          text: `Todo ${id} was updated.`
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