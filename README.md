# Threaded Comment System

A small full‑stack demo for a threaded comments UI with likes, pagination and nested replies.

## What this repo contains
- `server/` — Express + TypeScript backend using Prisma (Postgres) for persistence.
- `client/` — React + Vite frontend (Tailwind utilities present in dependencies).
- `prisma/` — Prisma schema and migrations for the database.

## Tech stack
- Backend: Node.js, Express, TypeScript
- ORM: Prisma (PostgreSQL / other SQL supported by Prisma)
- Frontend: React, Vite, date-fns
- Styling: Tailwind (utility dependency present)

## Features / Assumptions
- Threaded/nested comments with parent/child relationships preserved.
- Likes are stored in a `Like` join table and `Comment.likes` holds a denormalized count.
  - The database enforces one-like-per-user via a unique constraint on (userId, commentId).
  - The backend provides a transactional toggle endpoint to create/delete a like and increment/decrement the comment's like count atomically.
- Pagination for top-level comment fetches (GET `/api/comments?page=&limit=`).
- Frontend implements:
  - A `ThreadFeed` that fetches pages and supports "Load more" for older comments.
  - `CommentsContainer` / `CommentItem` components that show replies and include a "Load more replies" incremental reveal (non-destructive — threading logic is unchanged).
  - Like button UI which reflects whether the current user liked a comment.
  - Relative timestamps using `date-fns`.
  - Curved SVG connectors for nested replies (UI detail).

## Environment variables
Create a `.env` file inside `server/` with at least these values:

- `DATABASE_URL` — your Prisma-compatible database connection string (Postgres example: `postgresql://USER:PASS@HOST:PORT/DBNAME`).
- `PORT` — port for the backend (e.g. `4000`).
- `CLIENT_URL` — origin of the frontend during development (e.g. `http://localhost:5173`).

On the client side, provide the API base URL to Vite via an environment file (create `.env.local` in `client/`):

```
VITE_API_URL=http://localhost:4000
```

Adjust ports if you use different values.

## Quick start (development)

1. Start the database (Postgres). Ensure `DATABASE_URL` points at it.

2. Backend

```bash
cd server
npm install
# generate Prisma client
npx prisma generate
# apply migrations for local development (applies SQL in prisma/migrations)
npx prisma migrate dev
# start the backend (builds TS and runs dist/index.js as configured)
npm run dev
```

3. Frontend

```bash
cd client
npm install
# set VITE_API_URL in client/.env.local if different
npm run dev
```

The frontend (Vite) typically runs at `http://localhost:5173` and the backend at the `PORT` you set (example `http://localhost:4000`).

## Important endpoints
- GET `/api/comments?page=<n>&limit=<m>` — paginated comment listing (returns items, page, limit, total).
- POST `/api/comments` — create a comment (body contains comment data).
- POST `/api/comments/toggle-like` — toggle a like for a given user and comment. Body expects JSON: `{ userId, commentId }` and the response typically indicates `{ liked: true|false }`.

## Prisma / Database notes
- Migrations are present in `server/prisma/migrations/`. If you already have a database with the proper schema you can run `npx prisma migrate deploy` instead of `migrate dev` for CI/production flows.
- Use `npx prisma studio` to open a UI for browsing data during development.

## Development tips & troubleshooting
- If you see issues with the toggle-like endpoint returning 404, verify the server is running and that the frontend is configured to use `VITE_API_URL` that points to the same backend `PORT`.
- If you have Prisma errors about duplicate fields or relations, the easiest way to debug is to inspect `server/prisma/schema.prisma` and the migration SQL under `server/prisma/migrations/`.
- When running `git push` you might encounter SSH permission errors (e.g. `Permission denied (publickey)`). If so, either configure SSH keys for GitHub or switch your remote to HTTPS. This repo's README does not alter your Git config.

## Next steps / possible improvements
- Add automated tests for the like toggling controller (happy path + edge cases).
- Add optimistic UI updates and socket-based real-time updates for likes/replies.
- Add authentication/authorization wiring so `userId` is derived from a server-validated token instead of being passed from the client.

## Contact / Author
This project was worked on in a paired session. For follow-ups, open an issue or PR in the repository.
# threaded-comments
