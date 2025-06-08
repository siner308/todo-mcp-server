# todo-mcp-server

A simple, MCP-compatible todo server with SQLite, supporting priority, type, due date, and npx usage.

## Features
- Add, get, modify, remove todos
- Mark todos as done/undone
- Set priority (low/medium/high) and type (work, study, etc.)
- Set due date, track creation date
- Filter by priority, type, done status

## MCP Server Setup Example
```json
{
  "mcpServers": {
    "todo": {
      "command": "/path/to/node",
      "args": [
        "/path/to/todo-mcp-server/build/index.js"
      ]
    }
  }
}
```

## How to Build & Run Locally
```bash
# Requires Node.js v16 (for sqlite compatibility)
nvm use v16
npm i
npm run build
```

## License
MIT
