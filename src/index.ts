import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from "zod";
import { dbOperations } from "./database.js";

const server = new McpServer({
  name: "TODO",
  version: "1.0.0",
});

// Add Tools
server.tool(
  "add-todo",
  {
    text: z.string(),
  },
  async ({text}) => {
    const todo = dbOperations.addTodo(text);

    return {
      content: [
        {
          type: "text",
          text: `${text} was added to our todo with ID ${todo.id}`
        }
      ]
    }
  }
)

server.tool(
  "get-todos",
  {
  },
  async () => {
    const todos = dbOperations.getTodos();

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

    const todoList = todos.map((todo) => `${todo.id}: ${todo.text}`).join("\n");

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

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});