# Architecture Notes (Phase 1)

## Frontend (`/frontend/src`)

```
components/
  ui/         Reusable primitives: Logo, Button, Card, Input, LoadingScreen, ErrorState, EmptyState
  layout/     Navbar, Sidebar, StudentLayout, ProtectedRoute, Footer
pages/        Route-level screens: LandingPage, LoginPage, DashboardPage, NotFoundPage, UnauthorizedPage
layouts/      Reserved for future role-specific layouts (e.g. AdminLayout in Phase 6)
hooks/        useAuth (wraps AuthContext)
services/     api.js (axios instance), authService.js
contexts/     AuthContext.jsx (session state, login/register/logout)
charts/       Reserved for chart components (Phase 3+)
utils/        validators.js
```

## Backend (`/backend/src`)

```
config/       env.js (env loader), db.js (Prisma client + connect)
middleware/   auth.js (JWT guard), roleGuard.js, validate.js, errorHandler.js
controllers/  authController.js
services/     authService.js (business logic: register/login/lookup)
routes/       authRoutes.js, index.js
utils/        jwt.js, apiResponse.js
models/       Reserved — Prisma schema lives in /backend/prisma/schema.prisma
```

## Database (Phase 1 scope)

Two models only: `User` (identity + role + credentials) and `Student`
(profile fields, most nullable — populated fully during Phase 2 onboarding).
`Role` enum already includes `STUDENT | INSTITUTE | EMPLOYER | ADMIN` so
later phases can add those roles without a migration that breaks existing
data.

## Auth flow

1. `POST /api/auth/register` — student email validated (format + optional
   allow-listed domain), password hashed with bcrypt, user + student rows
   created in one transaction, access + refresh JWTs issued.
2. `POST /api/auth/login` — credentials checked, JWTs issued.
3. Frontend stores tokens in `localStorage`, attaches `Authorization: Bearer`
   via an axios interceptor, and calls `GET /api/auth/me` on load to restore
   the session.
4. `ProtectedRoute` blocks `/app/*` routes until `useAuth().isAuthenticated`
   is true; unauthenticated users are redirected to `/login` with the
   original destination preserved.

## Data-source abstraction

`DATA_SOURCE` in `backend/.env` is reserved for Phase 7 (Google Sheets
support). Phase 1 only implements the PostgreSQL path via Prisma, but the
env var and folder (`backend/src/dataSources` — to be added in Phase 7) are
already accounted for in the architecture so business logic won't need to
change later.
