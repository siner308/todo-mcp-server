# todo-mcp-server

## Features
- Add, get, modify, remove todo
- Mark todo as done/undone
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

## How to Setup (for local build)
```bash
# Node.js v16 환경이 필요합니다. (sqlite 호환)
# nvm 등으로 Node 16을 준비하세요.
nvm use v16
npm i
npm run build
```
