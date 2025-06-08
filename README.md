# todo mcp server

## features
- add todo
- get todos
- remove todo

## how to setup
```bash
# prepare node v16 (ex. nvm)
nvm use v16
npm i
npm run build
```

## 주의사항
sqlite 라이브러리가 node16을 사용해야 호환됩니다.

nvm을 사용하는 경우 default를 16으로 낮추면 되지만, 다른 mcp와 환경 분리를 하는것이 맞으므로 아래처럼 세팅하는게 좋습니다.

```json
{
  "mcpServers": {
    "todo": {
      "command": "{{NODE_BIN_PATH}}",
      "args": [
        "{{REPOSITORY_DIRECTORY}}/build/index.js",
      ]
    }
  }
}
```

## Example
```json
{
  "mcpServers": {
    "todo": {
      "command": "/Users/jeonghyunan/.nvm/versions/node/v16.20.2/bin/node",
      "args": [
        "/Volumes/SHGP31-2000GM/repositories/siner308/todo-mcp-server/build/index.js",
      ]
    }
  }
}
```
