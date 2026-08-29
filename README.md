# punchlinesonline

Web project Punch Lines Online.

# terminal 1

cd backend && mix phx.server

# terminal 2

cd frontend && npm run dev

# Host browser

UI: http://localhost:5173
API: http://localhost:4000/api/health
Postgres: localhost:5432 (user/pass postgres / postgres)

Rebuild the container after Dockerfile or feature changes: Command Palette → Dev Containers: Rebuild Container.

## Dev environment

Requires Docker + VS Code Dev Containers.

1. Open this folder in VS Code
2. Reopen in Container
3. `cd backend && mix ecto.setup && mix phx.server`
4. `cd frontend && npm install && npm run dev`
