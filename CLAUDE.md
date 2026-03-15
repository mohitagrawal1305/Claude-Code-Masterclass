# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server at http://localhost:3000
npm run build     # Production build
npm run lint      # Run ESLint
npm test          # Run all tests with Vitest
npx vitest tests/components/Navbar.test.tsx  # Run a single test file
```

## Architecture

**Pocket Heist** is a Next.js 16 / React 19 / TypeScript app for planning office pranks.

### Route Groups

- `app/(public)/` — Unauthenticated pages: splash (`/`), `/login`, `/signup`, `/preview`. The splash page (`page.tsx`) is intended as a routing gateway: redirect to `/heists` when logged in, `/login` when not.
- `app/(dashboard)/` — Authenticated pages: `/heists`, `/heists/create`, `/heists/[id]`. Layout wraps all pages with the `<Navbar>` component.

### Styling

- **Tailwind CSS v4** configured via `postcss.config.mjs`. Custom design tokens (colors, font) are defined in `app/globals.css` using the `@theme` block — use these token names (e.g., `text-primary`, `bg-dark`, `text-body`) rather than arbitrary values.
- **CSS Modules** are used for component-scoped styles (e.g., `Navbar.module.css`). CSS Modules that use `@apply` with theme tokens must include `@reference "../../app/globals.css"` at the top.
- Global utility classes like `.page-content`, `.center-content`, `.form-title` are defined in `globals.css`.

### Components

- Components live in `components/<ComponentName>/` with an `index.ts` barrel export, a `.tsx` file, and optionally a `.module.css` file.
- Path alias `@/` maps to the project root (configured via `tsconfig.json` and `vite-tsconfig-paths`).
- Client components that use React hooks must have `"use client"` at the top.

### Testing

- Tests use **Vitest** + **jsdom** + **Testing Library**. Setup file: `vitest.setup.ts`.
- Test files live under `tests/` mirroring the source structure (e.g., `tests/components/`).
- Use exact string matchers (`"Log In"`) rather than regex (`/log in/i`) when an element's `aria-label` or text could partially match other elements on the page.
- Mock `next/link` in component tests: `vi.mock("next/link", () => ({ default: ({ href, children }) => <a href={href}>{children}</a> }))`

### Slash Commands

Custom slash commands live in `.claude/commands/`:
- `/commit-message` — analyzes staged changes and proposes a commit message
- `/component <description>` — creates a new component using TDD (writes tests first, then implementation, then adds to preview page)
- `/spec <description>` — creates a feature spec file in `specs/` and switches to a new branch

### Feature Planning

- Specs live in `specs/` (human-readable requirements using `specs/template.md`)
- Implementation plans live in `_plans/` (detailed technical plans for Claude to execute)
