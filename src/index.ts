import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from "zod";
import { dbOperations } from "./database.js";

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
  },
  async ({text, priority = 'medium', type = 'General'}) => {
    const todo = dbOperations.addTodo(text, priority, type);

    return {
      content: [
        {
          type: "text",
          text: `${text} (priority: ${priority}, type: ${type}) was added to our todo with ID ${todo.id}`
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
  },
  async ({ priority, type }) => {
    const todos = dbOperations.getTodos(priority, type);

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

    const todoList = todos.map((todo) => `${todo.id}: ${todo.text} [priority: ${todo.priority}, type: ${todo.type}]`).join("\n");

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
  },
  async ({ id, text, priority, type }) => {
    const success = dbOperations.modifyTodo(id, { text, priority, type });
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