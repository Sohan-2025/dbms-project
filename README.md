# REPLATE Frontend

Next.js + React + TypeScript + Tailwind frontend for the agreed REPLATE API.

## Local development

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:4000/api

`NEXT_PUBLIC_USE_MOCKS=true` lets the frontend run without the backend. Set it to `false` when your friend's Express API is ready.

## Contract rule

`src/types/api.ts` and `src/lib/api.ts` follow the supplied `openapi.yaml`. Do not invent new JSON fields or endpoints in screens. If the contract changes, update the shared types/client first.

## Main routes

- `/` landing page
- `/login`
- `/donor/dashboard`
- `/donor/batches`
- `/donor/batches/new`
- `/donor/history`
- `/recipient/dashboard`
- `/recipient/food`
- `/recipient/requests`
- `/recipient/requests/new`
- `/recipient/allocations`
- `/volunteer/dashboard`
- `/volunteer/pickups`
- `/admin/dashboard`
- `/admin/batches`
- `/admin/requests`
- `/admin/allocations`
- `/admin/pickups`
- `/admin/analytics`
- `/admin/users`
- `/notifications`
- `/profile`

## Integration

The browser client uses `credentials: include` and the backend-owned HTTP-only `replate_session` cookie. No password or session token is stored in localStorage.
