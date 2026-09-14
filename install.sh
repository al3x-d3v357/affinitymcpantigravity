#!/usr/bin/env bash
set -e

echo "===================================================="
echo "🚀 Affinity MCP Server Installer for Antigravity (macOS)"
echo "===================================================="

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_PATH="$HOME/.gemini/config/mcp_config.json"

echo "\n[1/3] Installing dependencies and building..."
cd "$DIR"
npm install
npm run build

echo "\n[2/3] Registering in Antigravity ($CONFIG_PATH)..."
SERVER_PATH="$DIR/dist/index.js"

mkdir -p "$(dirname "$CONFIG_PATH")"

if [ -f "$CONFIG_PATH" ]; then
  # Simple node script to update JSON
  node -e "
    const fs = require('fs');
    const cfg = JSON.parse(fs.readFileSync('$CONFIG_PATH', 'utf8'));
    cfg.mcpServers = cfg.mcpServers || {};
    cfg.mcpServers.affinity = {
      command: 'node',
      args: ['$SERVER_PATH']
    };
    fs.writeFileSync('$CONFIG_PATH', JSON.stringify(cfg, null, 2));
  "
  echo "✅ Added 'affinity' to mcp_config.json!"
else
  cat <<EOF > "$CONFIG_PATH"
{
  "mcpServers": {
    "affinity": {
      "command": "node",
      "args": ["$SERVER_PATH"]
    }
  }
}
EOF
fi

echo "\n[3/3] Installation completed successfully! 🎉"
