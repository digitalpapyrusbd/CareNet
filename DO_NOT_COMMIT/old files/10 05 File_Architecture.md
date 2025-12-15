# File Architecture (Repository Reality)

**Version:** 3.0 (Synced With Current Monorepo Layout)  
**Last Updated:** 18 Nov 2025

This document reflects the *actual* structure that exists in the Caregiver workspace today. The project is a monorepo: the Next.js frontend lives at the repository root (`src`, `public`, etc.) and the NestJS API lives under `/backend`.

---

## Current Repository Layout

```
/Caregiver/
├── backend/                    # NestJS API + Prisma + tests
├── src/                        # Next.js 15 application source
├── public/                     # Static assets for Next.js
├── prisma/                     # Frontend Prisma client/schema artifacts
├── tests/                      # Playwright/load tests (frontend)
├── __tests__/                  # Jest/unit tests (frontend)
├── __mocks__/                  # Mock helpers for Jest
├── DO_NOT_COMMIT/              # Internal instructions + prompts
├── Resources/                  # Reference PRDs, architecture decks, etc.
├── node_modules/               # Workspace dependencies
├── package.json / package-lock.json
├── tsconfig.json / next.config.js / postcss.config.js / tailwind.config.js
├── docker-compose.test.yml / Dockerfile.test
├── misc scripts (check_monitor.sh, run_monitor.sh)
└── repo-wide env/config files (.env*, jest configs, README, guides)
```

---

## Frontend (Next.js at Repository Root)

### `/src` Snapshot

```
/src/
├── app/
├── components/
├── hooks/
├── lib/
├── services/
├── store/
├── types/
├── utils/
├── middleware.ts
└── test/ (app-specific helpers)
```

### `src/app` Route Groups & Features

```
/src/app/
├── api/                 # Route handlers
├── auth/                # Auth flows (login, register, OTP)
├── care-logs/           # Care log UI surfaces
├── dashboard/           # Role dashboards
├── disputes/
├── escrow/
├── feedback/
├── files/
├── job-assignment/
├── jobs/
├── notifications/
├── offline/             # PWA offline entry points
├── packages/
├── patient-management/
├── patients/
├── payments/
├── profile/
├── verification/
├── globals.css          # Global styles
├── layout.tsx           # Root layout providers
└── page.tsx             # Landing page
```

### Other Frontend Folders

- `src/components/` → `ui/`, `forms/`, `layout/`, `mobile/`, `patients/`, `performance/`, `providers/`, plus `index.ts` barrel file.
- `src/lib/` → API client, helpers, validation, formatting.
- `src/hooks/` → auth/media-query/geolocation/camera hooks.
- `src/services/` → typed client-side service wrappers.
- `src/store/` → Zustand slices and context stores.
- `src/types/`, `src/utils/` → shared TypeScript models/utilities.
- `public/` → static assets, icons, manifest/service worker (if needed).
- Root-level configs: `next.config.js`, `postcss.config.js`, `tailwind.config.js`, `tsconfig.json`, `jest.config.js`.

---

## Backend (NestJS in `/backend`)

### High-Level Layout

```
/backend/
├── src/
│   ├── analytics/
│   ├── auth/
│   ├── care-logs/
│   ├── caregivers/
│   ├── common/
│   ├── companies/
│   ├── disputes/
│   ├── feedback/
│   ├── files/
│   ├── jobs/
│   ├── notifications/
│   ├── packages/
│   ├── patients/
│   ├── payments/
│   ├── users/
│   ├── app.controller.ts / .spec.ts
│   ├── app.module.ts / app.service.ts
│   └── main.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│       ├── 20251118111703_init
│       ├── 20251118164658_make_job_id_optional_in_payments
│       ├── 20251118171401_make_assignment_optional_in_care_logs
│       └── 20251118171514_add_verification_notes_to_caregivers
│
├── test/
│   └── app.e2e-spec.ts (plus supporting E2E helpers)
│
├── dist/ (build output)
├── coverage/ (Jest reports)
├── package.json / package-lock.json
├── tsconfig.json / tsconfig.build.json / nest-cli.json
├── eslint.config.mjs / .prettierrc
├── README.md / TESTING_SETUP.md / TESTING_PROGRESS.md / E2E_TESTS.md
└── .env (API-specific environment variables)
```

### Module Notes

- `auth/` → controllers, services, decorators, guards, strategies, DTOs for JWT + OTP auth.
- `common/` → Prisma module/service, decorators, filters, guards, interceptors, pipes, utilities shared across modules.
- `jobs/` → job CRUD plus assignment DTOs and controllers now matching current E2E expectations.
- `payments/` → controller, service, DTOs, provider integrations (bkash/nagad), escrow helpers.
- `care-logs/`, `caregivers/`, `companies/`, `disputes/`, `feedback/`, `notifications/`, etc. exist but many endpoints remain partially implemented per progress checklist.

---

## Shared Assets & Tooling

- `DO_NOT_COMMIT/` → Working documents, AI agent prompts, progress checklists (this file lives here).
- `Resources/` → Reference copies of PRDs, architecture diagrams, UX flows, compliance checklists.
- `tests/` → Load/perf scripts (`tests/load/`), additional automation harnesses.
- `prisma/` at repo root → Legacy/shared Prisma schema (used by frontend tooling), mirrors backend schema where needed.
- Automation/config scripts: `check_monitor.sh`, `run_monitor.sh`, `FRONTEND_API_MIGRATION.md`, `MOBILE_OPTIMIZATION.md`, `PERFORMANCE_OPTIMIZATION.md`, `PWA_TESTING_GUIDE.md`, `TESTING_QA_PLAN.md`, `TOUCH_UI_OPTIMIZATION.md`.

---

## Deviation From Previously Documented Structure

1. **No `/frontend` directory:** The Next.js app resides directly under the repo root (`src`, `public`, configs). Prior documentation assumed a `/frontend` folder with duplicated tree.
2. **Backend already lives in `/backend`:** That part matched, but the documented module list contained extra placeholders (e.g., `/notifications/providers/`) that are not present yet.
3. **Additional top-level folders now exist:** `DO_NOT_COMMIT/`, `Resources/`, `__tests__/`, `__mocks__/`, `tests/`, `test-mocks/`, `check_monitor.sh`, etc., none of which were captured in the older diagram.
4. **Prisma layout differs:** Backend Prisma migrations use timestamped directories listed above; frontend keeps its own `/prisma/` folder at the root, not under `/frontend/prisma/` as previously noted.
5. **Frontend route map diverged:** Actual route groups (`care-logs`, `escrow`, `verification`, etc.) differ from the exhaustive storyboarded tree that mixed dashboards and nested dynamic routes.
6. **State/utility folders renamed:** Documentation referenced `/context/` and `/types/` inside `/frontend/src`; in practice we use `src/store/` for Zustand state and keep `src/types/` at root (no `/context` directory today).

These discrepancies are now resolved in the sections above, which describe the repository exactly as checked into source control on 18 Nov 2025.
