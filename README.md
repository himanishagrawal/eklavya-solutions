# Eklavya Solutions
### "Bridging Skills with Industry"

An evidence-based platform connecting industry demand, training curricula and
individual skill development. This repository is being built **incrementally,
phase by phase** — this README reflects **Phase 1: Project Foundation**.

---

## What's in Phase 1

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

Create the database schema:

```bash
npx prisma migrate dev --name init
```

Seed the demo student:

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
hard-coded frontend bypass.

---

## Environment variables

See `backend/.env.example` and `frontend/.env.example` for the full list.
Never commit a real `.env` file — only `.env.example` belongs in version
control.

---

## Development phases

This project is built phase by phase, and each phase only extends the
previous one (nothing is rebuilt from scratch). Phase 1 covers project
foundation, auth, branding, and core layout. See the master specification
for the full Phase 1–8 roadmap.
