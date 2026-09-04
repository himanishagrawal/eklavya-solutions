# Architecture Notes (Phase 1 + Phase 2)

## Frontend (`/frontend/src`)

```
components/
  ui/          Reusable primitives: Logo, Button, Card, Input, Select, Textarea,
               Badge, LoadingScreen, ErrorState, EmptyState
               (Select, Textarea, Badge added in Phase 2)
  layout/      Navbar, Sidebar, StudentLayout, ProtectedRoute, Footer
  onboarding/  PHASE 2: StepIndicator, PersonalStep, CareerStep, SkillsStep, ReviewStep
pages/         LandingPage, LoginPage, RegisterPage (P2), OnboardingPage (P2),
               DashboardPage, ProfilePage (P2), SkillsPage (P2), NotFoundPage,
               UnauthorizedPage
layouts/       Reserved for future role-specific layouts (e.g. AdminLayout in Phase 6)
hooks/         useAuth (wraps AuthContext)
services/      api.js, authService.js, studentService.js (P2), skillService.js (P2)
contexts/      AuthContext.jsx (session state, login/register/logout/refreshUser)
charts/        Reserved for chart components (Phase 3+)
utils/         validators.js, onboardingOptions.js (P2 - static industry/role/
               work-preference/proficiency option lists)
```

## Backend (`/backend/src`)

```
config/       env.js (env loader), db.js (Prisma client + connect)
middleware/   auth.js (JWT guard), roleGuard.js, validate.js, errorHandler.js,
              ownership.js (P2 - requireOwnStudent)
controllers/  authController.js, studentController.js (P2), skillController.js (P2)
services/     authService.js, studentService.js (P2), skillService.js (P2)
routes/       authRoutes.js, studentRoutes.js (P2), skillRoutes.js (P2), index.js
utils/        jwt.js, apiResponse.js, profileCompletion.js (P2 - shared scoring util,
              also used by prisma/seed.js)
models/       Reserved — Prisma schema lives in /backend/prisma/schema.prisma
```

## Database

**Phase 1**: `User` (identity + role + credentials) and `Student` (profile
fields). `Role` enum already includes `STUDENT | INSTITUTE | EMPLOYER | ADMIN`
so later phases can add those roles without a breaking migration.

**Phase 2 additions** (all additive - no Phase 1 fields removed or renamed):
- `Student` gained: `onboardingCompleted`, `certifications`, `projects`,
  `internshipExperience`, `resumeUrl`.
- New `Skill` model — global catalog (`id`, `name` unique, `category`).
- New `StudentSkill` join model — `studentId` + `skillId` with a
  `@@unique([studentId, skillId])` constraint (so a student can't have the
  same skill twice) and a `proficiency` (`Proficiency` enum:
  `BEGINNER | INTERMEDIATE | ADVANCED`).
- `targetIndustry` / `targetRole` / `targetLocation` / `workPreference`
  remain plain fields on `Student` (not a relational job-role table) - this
  is intentional. Phase 3's skill-gap engine will read these fields
  directly; modeling a full `job_roles` table is explicitly out of scope
  until Phase 3 per the master spec.

## Auth flow (Phase 1, unchanged + one additive field)

1. `POST /api/auth/register` — student email validated, password hashed,
   user + student rows created, JWTs issued.
2. `POST /api/auth/login` — credentials checked, JWTs issued.
3. **(Phase 2)** The JWT payload now also carries `studentId` (in addition
   to the Phase 1 `sub`/`email`/`role`), so ownership checks on
   `/api/students/:id` routes are a cheap comparison with no extra DB
   lookup. This is purely additive - Phase 1 token verification logic in
   `middleware/auth.js` is untouched.
4. Frontend stores tokens in `localStorage`, attaches `Authorization: Bearer`
   via an axios interceptor, and calls `GET /api/auth/me` on load to restore
   the session. **(Phase 2)** `AuthContext.refreshUser()` re-runs this same
   call on demand, so onboarding/profile edits reflect app-wide without a
   full re-login.
5. `ProtectedRoute` blocks `/app/*` routes until authenticated - unchanged.

## Phase 2: ownership model

Every `/api/students/:id*` route requires: `requireAuth` → `roleGuard('STUDENT')`
→ `requireOwnStudent`. The last step compares `req.params.id` against
`req.user.studentId` from the JWT - a student can only ever read or write
their own profile/skills. This is applied **per-route** (not via a blanket
`router.use()`), because Express only populates `req.params` once a specific
route pattern has matched.

## Phase 2: profile completion scoring

`backend/src/utils/profileCompletion.js` computes a 0-100 score from actual
stored data (35% personal fields, 30% career fields, 20% skills count capped
at 5, 15% optional fields) — recalculated server-side after every profile
update, skill add, skill remove, and onboarding completion. The frontend
never sends or trusts a completion percentage; it only ever displays what
the backend computed. The same function is imported by `prisma/seed.js` so
the demo student's completion percentage is real, not hard-coded.

## Data-source abstraction

`DATA_SOURCE` in `backend/.env` is reserved for Phase 7 (Google Sheets
support). Still untouched in Phase 2 - only the PostgreSQL path via Prisma
is implemented.
