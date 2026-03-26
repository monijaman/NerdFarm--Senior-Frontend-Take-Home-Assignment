
# Pearson Specter Litt Command Center — Take-Home Assignment

## Overview

This project is a simplified Command Center for foreclosure law firms, built as a take-home assignment for Pearson Specter Litt. It demonstrates a dynamic, schema-driven task queue and detail/action view, with role-based visibility, filtering, sorting, and full test coverage.

- **Framework:** Next.js (App Router), React, TypeScript
- **UI:** Tailwind CSS (custom theme)
- **State:** Zustand (task/user stores)
- **Testing:** Vitest + React Testing Library

## Features

- **Task Queue:**
	- Prioritized, filterable, and sortable list of tasks
	- Visual urgency indicators (SLA deadline, revenue at risk)
	- Responsive and accessible UI
- **Task Detail / Action View:**
	- Renders forms dynamically from backend schema (no hardcoded layouts)
	- Supports all field types: text, textarea, select, checkbox, date, number, currency, table (with inline editing)
	- Conditional field visibility (`visibleWhen` logic)
	- Role-based field/section/action visibility (toggle role in header)
	- Form validation and schema-driven action gating
	- Optimistic UI for task removal
	- Accessible (ARIA, keyboard navigation, live regions)
- **Testing:**
	- 44 tests: schema renderer, filtering/sorting, visibility, integration (task selection → form fill → action enable)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run tests

```bash
npm test
```

## Usage

- **Role Toggle:**
	- Use the role toggle in the header to switch between `processor` and `attorney` roles. The form will update to show/hide fields and actions based on the current role.
- **Filtering & Sorting:**
	- Use the filter bar above the task queue to filter by client, region, category, and status. Multiple filters combine with AND logic. Sort by priority, SLA deadline, or revenue at risk.
- **Task Actions:**
	- Select a task to open its detail view. Fill required fields to enable the primary action. All actions log a submission payload to the console and show a success toast. Optimistic UI removes the task from the queue immediately.
- **Mobile/Accessibility:**
	- The UI is fully responsive and accessible. Use keyboard navigation and screen readers for full access.

## Project Structure

- `src/app/` — Next.js app router, global styles, layout
- `src/components/` — Atoms, ErrorBoundary, layout wrappers
- `src/features/taskQueue/` — Task queue, filters, sorting, TaskCard
- `src/features/taskDetail/` — Task detail view, schema renderer, helpers
- `src/features/schemaRenderer/` — Dynamic form renderer, field components
- `src/store/` — Zustand stores for tasks and user
- `src/tests/` — All test files (unit + integration)
- `frontend_assignment_data/` — Mock API data (copied from assignment)

## Mock API

- All API endpoints are implemented using Next.js route handlers and static JSON files in `frontend_assignment_data/`.
- See the assignment for full API specs and data file descriptions.

## Notes

- No backend required — all data is local and served via mock API routes.
- For architectural decisions, see `DECISIONS.md`.

---

