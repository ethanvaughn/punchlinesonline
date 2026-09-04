#!/usr/bin/env bash

set -euo pipefail

install -m 0644 .devcontainer/.zshrc ~/.zshrc
install -m 0644 .devcontainer/.psqlrc ~/.psqlrc
bash .devcontainer/configure-git.sh

# Print versions of important tools
echo -n "Elixir version:"
mix --version
echo -n "Node.js version:"
node --version
echo -n "npm version:"
npm --version
