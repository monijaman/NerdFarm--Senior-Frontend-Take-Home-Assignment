# DECISIONS.md

## Key Architectural Decisions

- **Schema-Driven Rendering:**
  - All task detail forms are rendered dynamically from backend-provided schemas. No field or section is hardcoded. The schema renderer is extensible to new field types and schema shapes.
- **State Management:**
  - Used Zustand for global state (tasks, user, selection, optimistic removal). This avoids prop-drilling and keeps state logic isolated from UI components.
- **Component Decomposition:**
  - Atoms (Button, Badge, etc.) are centralized. Task queue, filters, and schema renderer are feature modules. The schema renderer is split into SchemaRenderer, SchemaSection, and SchemaField for clarity and extensibility.
- **Role-Based Logic:**
  - Role visibility (fields, sections, actions) is handled centrally in the schema renderer using the schema's `roleVisibility` property. The role toggle in the header updates the user store and triggers a re-render.
- **Validation & Submission:**
  - Validation is schema-driven: only visible, required fields are validated. Submission payloads include only visible fields. Optimistic UI is used for task removal.
- **Testing:**
  - All core logic is covered: schema rendering, filtering/sorting, visibility, and integration (task selection → form fill → action enable).

## What I'd Change or Add with More Time

- Add more robust error handling and user feedback for API/network failures.
- Expand accessibility testing (screen reader, keyboard traps, color contrast).
- Add more field types (file upload, nested objects, etc.) and more complex table editing.
- Add real-time updates (WebSocket or polling) for live task changes.
- Refactor some UI for even better mobile ergonomics.
- Add e2e tests (Playwright or Cypress) for full user flows.

## Assumptions

- All schemas and data files are trusted and well-formed.
- Only two roles (`processor`, `attorney`) are required for demo.
- No authentication or authorization is needed for the mock API.
- Optimistic UI is sufficient for demo; no real server rollback is required.

## Nice to Have Items Chosen

- **Optimistic UI:** Task is removed from the queue immediately on action, with animation and simulated server confirmation.
- **Responsive Layout:** Fully mobile-friendly, with adaptive header and scroll fixes.
- **Accessibility:** ARIA roles, live regions, and keyboard navigation are implemented.

---

