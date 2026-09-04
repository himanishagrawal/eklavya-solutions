# Eklavya Solutions
### "Bridging Skills with Industry"

An evidence-based platform connecting industry demand, training curricula and
individual skill development. This repository is being built **incrementally,
phase by phase** — this README reflects **Phase 1 (Project Foundation) +
Phase 2 (Student Onboarding, Profile, Skills, Target Career)**.

---

## What's in Phase 1 (unchanged, still working)

- Project scaffolding for a React (Vite) frontend and an Express + PostgreSQL
  (Prisma) backend, structured for every future phase in the master spec.
- Secure authentication foundation: JWT access/refresh tokens, bcrypt password
  hashing, student email validation, protected routing.
- Eklavya Solutions branding, dark premium design system, responsive
  navbar/sidebar, landing page, login page, and a student dashboard shell.
- A seeded demo student account so the flow can be tried end-to-end without
  manual registration.

Skill-gap analysis, course/job recommendations, learning tracking, and admin
analytics are **not** implemented yet — those arrive in later phases. Areas of
the UI reserved for them are clearly labeled "Available in a future phase"
rather than faked.

## What's new in Phase 2

- **Registration** page (the backend already supported it in Phase 1; it now
  has a UI so new students can create an account).
- **Multi-step onboarding wizard** (`/app/onboarding`) — 4 steps (Personal,
  Career, Skills, Review) with a progress indicator, collecting personal
  info, target industry/role/location/work-preference, skills with
  proficiency, and optional certifications/projects/internship/resume.
- **Student Profile** page (`/app/profile`) — view and edit everything
  collected during onboarding; changes are persisted to PostgreSQL and
  reflected immediately across the app (dashboard, sidebar).
- **My Skills** page (`/app/skills`) — add, remove, and update proficiency
  for skills, backed by a real ~45-skill catalog seeded into the database
  (never hard-coded in the frontend).
- **Target career** (industry, role, location, work preference) is stored on
  the `Student` model as plain fields — deliberately not a full relational
  job-role system yet, so Phase 3's skill-gap engine can build on it without
  another schema rewrite.
- **Real, computed profile completion** — replaces the Phase 1 placeholder
  value with a score derived from actual filled-in fields + skill count.
- Dashboard now shows a soft "finish onboarding" prompt (only if
  incomplete) and a real "My Skills" summary card, sourced from the API.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS, React Router, Framer Motion, Lucide icons |
| Backend | Node.js + Express |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT (access + refresh), bcrypt password hashing |

## Project structure

```
/frontend   React SPA (components, pages, layouts, hooks, services, contexts)
/backend    Express API (controllers, routes, services, middleware, config)
/database   Prisma migrations output + seed data
/docs       Project documentation
```

See `/docs/ARCHITECTURE.md` for the full folder breakdown.

---

## Running the project

### 0. Prerequisites
- Node.js 18+ and npm
- A running PostgreSQL instance (local install, Docker, or a hosted free tier)

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: set DATABASE_URL to your PostgreSQL connection string,
# and set JWT_ACCESS_SECRET / JWT_REFRESH_SECRET to random strings.
```

Create/update the database schema:

```bash
npx prisma migrate dev --name phase2_onboarding_profile_skills
```

> If this is a clean environment (Phase 1 was never run against this
> database), Prisma will create every table in one pass — you don't need
> to run the Phase 1 migration separately first.

Seed demo data (a ~45-skill catalog + the demo student, now with a
completed onboarding profile and real skills):

```bash
npm run seed
```

Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Check `http://localhost:5000/api/health`.

### 2. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173` and proxies `/api` requests to the
backend during development.

### 3. Open the app

Visit `http://localhost:5173`. Click **"Try demo student login"** on the login
page, or log in manually with the demo credentials below.

### 4. Run backend tests

```bash
cd backend
npm test
```

---

## Demo login

```
Email:    aarav.sharma@demo.eklavya.in
Password: Demo@1234
```

This account is created by `npm run seed` and is clearly marked `isDemo: true`
in the database — it authenticates through the real login API, it is not a
hard-coded frontend bypass. As of Phase 2, the demo student is seeded with
`onboardingCompleted: true`, a filled-in profile, and a handful of real
skills, so you can log in and go straight to Profile / My Skills / Dashboard
without running through onboarding yourself.

### Testing the Phase 2 flow end-to-end

1. Go to `/register`, create a brand-new account (any student-formatted
   email + password).
2. You're redirected straight to `/app/onboarding` — walk through all 4
   steps (Personal → Career → Skills → Review) and submit.
3. You land on `/app/dashboard` — the onboarding prompt is gone, "My
   Skills" shows the skills you just added, and profile completion is a
   real, non-zero percentage.
4. Visit `/app/profile`, edit a field, save, refresh the page — the change
   persisted (real PostgreSQL data, not local state).
5. Visit `/app/skills`, add/remove a skill and change a proficiency level —
   each action calls the API immediately.
6. Log out and back in — everything you entered is still there.

---

## Environment variables

See `backend/.env.example` and `frontend/.env.example` for the full list.
Never commit a real `.env` file — only `.env.example` belongs in version
control.

---

## Development phases

This project is built phase by phase, and each phase only extends the
previous one (nothing is rebuilt from scratch). Phase 1 covered project
foundation, auth, branding, and core layout. Phase 2 adds student
onboarding, profile management, skill tracking, and target-career data —
all persisted in PostgreSQL, none of it faked. See the master specification
for the full Phase 1–8 roadmap.
