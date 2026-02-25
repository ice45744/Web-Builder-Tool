# REST Express API Migration

## Overview
This project is a Node.js/Express REST API with a React frontend (Vite).
It uses PostgreSQL with Drizzle ORM for data persistence.

## Tech Stack
- Frontend: React, Vite, TanStack Query, Shadcn UI
- Backend: Node.js, Express
- Database: PostgreSQL, Drizzle ORM
- Language: TypeScript

## Key Files
- `server/index.ts`: Entry point for the backend
- `server/routes.ts`: API routes
- `shared/schema.ts`: Database schema and types
- `client/src/App.tsx`: Frontend entry point
- `drizzle.config.ts`: Drizzle configuration

## Deployment
The app is configured to build with `npm run build` and run with `node ./dist/index.cjs`.
