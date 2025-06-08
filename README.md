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
      "command": "npx",
      "args": [
        "-y",
        "@siner308/todo-mcp-server"
      ]
    }
  }
}
```

## Data Directory (Optional)
By default, data is stored in a temporary directory (e.g., `/tmp/todo-mcp-server`).
To specify a custom data directory, set the `DATA_DIR` environment variable:

### MCP Server Example with env
```json
{
  "mcpServers": {
    "todo": {
      "command": "npx",
      "args": [
        "-y",
        "@siner308/todo-mcp-server"
      ],
      "env": {
        "DATA_DIR": "/your/data/dir"
      }
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
