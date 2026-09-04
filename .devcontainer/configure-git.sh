#!/usr/bin/env bash

# Set general global cinfigs
git config --global core.pager cat

# Prompt and set git user email and name
set -euo pipefail

read -r -p "Git email: " git_email
read -r -p "Git name: " git_name

git config --global user.email "$git_email"
git config --global user.name "$git_name"