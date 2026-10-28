# REPLATE: Frontend–Backend Integration Contract

This document is the source of truth for Person 1 (backend/database) and Person 2 (frontend).
The OpenAPI file is the machine-readable contract. Do not invent routes, field names, statuses, or response shapes separately in the frontend.

## 1. Agreed local architecture

- Frontend: Next.js + React + TypeScript + Tailwind, `http://localhost:3000`
- Backend: Express + TypeScript, `http://localhost:4000`
- API prefix: `/api`; base URL is `http://localhost:4000/api`
- Database: PostgreSQL; backend owns all SQL and database access.
- JSON field naming: `camelCase` over HTTP. Database column naming can be `snake_case`.
- IDs: opaque UUID strings. The frontend must not parse them as numbers or manufacture IDs.
- Dates/timestamps: ISO 8601 strings with timezone, for example `2026-10-28T15:30:00.000Z`. Send timestamps in UTC where possible.
- Quantities: JSON numbers, with a separate `unit` enum. Never compare quantities with different units as though they were the same.

## 2. Files to use

- `openapi.yaml`: complete API contract; import into Swagger Editor/Postman or use it to generate client types.
- `frontend/src/types/api.ts`: TypeScript DTOs/enums for the frontend.
- `frontend/src/lib/api.ts`: typed `fetch` wrapper and route methods; uses credentials for cookie sessions.
- `frontend/.env.local.example`: required frontend environment variable.
- `examples/api-examples.json`: valid example requests and responses.

Person 2 can copy `frontend/src/types/api.ts` and `frontend/src/lib/api.ts` into the Next.js app. If the app does not use the `@/` alias, update the two imports to match the project's `tsconfig.json` paths.

## 3. Response formats (must be consistent)

Single object / dashboard:
```json
{ "data": { "id": "uuid", "status": "AVAILABLE" } }
```

List without pagination:
```json
{ "data": [] }
```

Paginated list:
```json
{
  "data": [],
  "meta": { "page": 1, "pageSize": 20, "total": 0, "totalPages": 0 }
}
```

Error:
```json
{
  "error": {
    "code": "INSUFFICIENT_QUANTITY",
    "message": "Only 40 PORTION remain available for this batch.",
    "details": [{ "field": "quantity", "message": "Requested 80; available 40." }]
  },
  "requestId": "req_example"
}
```

Do not return `{ success: true, result: ... }` in one route and `{ data: ... }` in another. Do not return a bare array for one list endpoint and an envelope for another.

### HTTP status conventions

- `200`: successful read/update
- `201`: successful creation
- `204`: successful logout/no response body
- `400`: malformed request
- `401`: missing/expired login session
- `403`: logged in but wrong role or wrong resource ownership
- `404`: resource not found
- `409`: conflict with current state, e.g. insufficient stock or allocation already processed
- `422`: validation/business-rule failure
- `500`: unexpected backend failure

## 4. Authentication contract

Use a server-set, HTTP-only cookie named `replate_session`.

- `POST /api/auth/login` with `{ "email": "...", "password": "..." }` returns `{ "data": { "user": User } }` and sets the cookie.
- `GET /api/auth/me` returns the same user shape.
- `POST /api/auth/logout` clears the cookie and returns `204`.
- Frontend calls must use `credentials: "include"`. Never put the session cookie or password in localStorage.
- Roles are exactly `DONOR`, `RECIPIENT`, `VOLUNTEER`, `ADMIN`.
- Backend enforces role access and resource ownership. Hiding a button in the UI is not authorization.
- Person 1 must provide demo credentials (one account per role) separately once seeded. Do not hardcode fake passwords in this contract.

### CORS for local development

Backend should allow origin `http://localhost:3000` with credentials enabled. Use an explicit origin, not `*`, when `credentials: true` is used. For local development, configure cookie flags to work on localhost; production cookie settings must be tightened for HTTPS.

## 5. API route inventory

| Method | Endpoint | Intended UI |
|---|---|---|
| GET | `/api/health` | connection/status check |
| POST | `/api/auth/login` | login form |
| GET | `/api/auth/me` | restore session on refresh |
| POST | `/api/auth/logout` | sign out |
| GET | `/api/food-types` | food selection/search dropdowns |
| GET | `/api/donor/dashboard` | donor KPI cards and recent batches |
| GET | `/api/donor/locations` | donor location selector |
| GET/POST | `/api/donor/batches` | donor inventory list + create batch form |
| GET | `/api/recipient/dashboard` | recipient summary |
| GET | `/api/recipient/available-food` | available food catalogue |
| GET/POST | `/api/recipient/requests` | recipient request list + create form |
| GET | `/api/recipient/allocations` | recipient allocation tracking |
| GET | `/api/admin/dashboard` | admin KPI cards/trend |
| GET | `/api/admin/batches` | operational batch table |
| POST | `/api/admin/batches/:batchId/inspection` | approve/reject batch |
| GET | `/api/admin/requests` | all recipient requests |
| POST | `/api/admin/allocations` | allocate inventory to request |
| POST | `/api/admin/pickups` | assign volunteer/vehicle to allocation |
| GET | `/api/admin/volunteers` | volunteer dropdown for pickup assignment |
| GET | `/api/admin/vehicles` | vehicle dropdown for pickup assignment |
| GET | `/api/admin/analytics` | charts and impact analytics |
| GET | `/api/volunteer/pickups` | volunteer task list |
| PATCH | `/api/volunteer/pickups/:pickupId/status` | pickup/delivery status action |

The endpoint definitions and exact request/response schemas are in `openapi.yaml`. If both partners agree to change a field, update the OpenAPI file and the TypeScript type in the same commit/message before changing either implementation.

## 6. Lifecycle/state rules

### Food batch status

`PENDING_INSPECTION` → `AVAILABLE` after a passing inspection. A failed inspection changes it to `REJECTED`. As inventory is allocated, status is `PARTIALLY_ALLOCATED` or `FULLY_ALLOCATED`. A batch can become `EXPIRED` or `WASTED` through backend-controlled rules.

### Request status

`OPEN` → `PARTIALLY_FULFILLED` → `FULFILLED`; it may also be `CANCELLED` or `EXPIRED`.

### Allocation/pickup status

An allocation is created as `CONFIRMED`; scheduling the pickup moves it to `PICKUP_SCHEDULED`; pickup/delivery actions progress it to `PICKED_UP` and `DELIVERED`. Failed/cancelled cases must use `FAILED`/`CANCELLED` consistently.

The frontend should display statuses from the API, not calculate them from assumptions. Backend should reject invalid state transitions with a consistent `409` error.

## 7. Critical database rules belong to the backend

For `POST /api/admin/allocations`, Person 1 must execute a single PostgreSQL transaction that:

1. locks the target `food_batch` row (e.g. `SELECT ... FOR UPDATE`),
2. verifies batch passed inspection, is not expired, and has sufficient available quantity,
3. verifies request is open/partly fulfilled and food type/unit match,
4. decreases batch available quantity,
5. inserts allocation with a historical `expirySnapshot`,
6. updates request fulfilment status/quantity,
7. commits all changes together or rolls all of them back.

Never rely on frontend-only checks for quantity, expiry, role, or status. Return `409` for a live-state conflict, with an error code such as `INSUFFICIENT_QUANTITY`.

Similarly, inspection + batch status updates and pickup/delivery updates must be transactional when multiple rows change.

## 8. Pagination and filters

Use query params `page` (default 1) and `pageSize` (default 20, max 100). The response must always include `meta` for paged endpoints. The frontend must render `meta.total` / `meta.totalPages`, not infer totals from the current page length.

Status filters must use exact enum values from `frontend/src/types/api.ts`.

## 9. API client usage from the frontend

Example:
```ts
import { api, ApiError } from "@/lib/api";

try {
  const result = await api.donorBatches(1, 20, "AVAILABLE");
  setBatches(result.data);
  setTotalPages(result.meta?.totalPages ?? 1);
} catch (error) {
  if (error instanceof ApiError && error.status === 401) {
    // Redirect to login / show session expired state.
  } else {
    // Show a useful error toast; do not silently swallow the error.
  }
}
```

Frontend forms should validate obvious errors for UX, but backend validation remains authoritative. Disable submit buttons while requests are in flight. Show loading, empty, success, and error states.

## 10. Local run/check contract

1. PostgreSQL database and seed data are ready.
2. Backend listens at `http://localhost:4000` and exposes `GET http://localhost:4000/api/health`.
3. Frontend `.env.local` contains `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api`.
4. Start frontend at `http://localhost:3000`.
5. Verify browser Network tab calls the expected `/api/...` route and sends the cookie.
6. Test all four seeded roles and confirm backend returns `403` when the wrong role calls a restricted route.
7. Test invalid/expired batch, insufficient quantity, rejected batch, duplicate submission, and concurrent allocation cases.

## 11. Agreement checklist before integration

- [ ] Agree that `openapi.yaml` is the contract, not chat screenshots or handwritten field names.
- [ ] Backend uses the paths, casing, enums, envelopes, and status codes in this contract.
- [ ] Frontend imports the shared DTOs and API client rather than redefining them independently.
- [ ] Backend shares seeded test account credentials privately with the frontend developer.
- [ ] Any contract change is communicated before code is built on top of it.

This contract reduces integration mismatches, but integration still needs to be tested against the running API; no document can guarantee zero runtime errors by itself.
