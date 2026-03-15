# Plan: Authentication Forms

branch: claude/feature/auth-forms

## Context
The `/login` and `/signup` pages are currently placeholder stubs with just a heading. This plan implements full authentication forms on both pages — email field, password field with show/hide toggle, client-side validation, and a console.log on submit. A link lets users switch between forms. No API integration yet.

Password validation rule (from spec): minimum 5 characters, at least 1 special character.

---

## Approach: Shared `AuthForm` component

Create a single `AuthForm` component accepting `mode: "login" | "signup"`. Both forms are identical in structure — sharing one component means validation, toggle, and submit logic live in one place. Each page becomes a thin wrapper.

---

## Files to Create

### `components/AuthForm/AuthForm.tsx`
- `"use client"` directive required (uses `useState`)
- Props: `mode: "login" | "signup"`
- State: `email`, `password`, `showPassword`, `errors`
- Derive title, submit label, and switch link from `mode`
- `Eye` / `EyeOff` icons from `lucide-react` for show/hide toggle (same lib as Navbar's `Clock8`)
- `Link` from `next/link` for the switch-form link
- Validation runs **on submit only**:
  - Email empty → "Email is required."
  - Password < 5 chars → "Password must be at least 5 characters."
  - Password no special char → "Password must contain at least 1 special character."
  - Valid → `console.log({ email, password })`
- Use `noValidate` on the form to suppress browser-native tooltips
- Password input `type` toggles between `"password"` and `"text"`
- Toggle button must have `type="button"` and `aria-label` ("Show password" / "Hide password")

### `components/AuthForm/AuthForm.module.css`
- Must start with `@reference "../../app/globals.css"` (same as `Navbar.module.css`)
- Classes: `.form`, `.field`, `.label`, `.input`, `.inputError`, `.error`, `.passwordWrapper`, `.toggleBtn`, `.submitBtn`, `.switchText`, `.switchLink`
- Input uses `bg-lighter`, focus ring `border-primary`, error state `border-error`
- Submit button: `bg-primary text-dark` (high contrast on purple)
- Toggle button: positioned `absolute right-3 top-1/2 -translate-y-1/2`; input needs right padding to avoid text overlapping icon

### `components/AuthForm/index.ts`
```ts
export { default } from "./AuthForm"
```

### `tests/components/AuthForm.test.tsx`
Mock `next/link` at the top:
```ts
vi.mock("next/link", () => ({ default: ({ href, children }: any) => <a href={href}>{children}</a> }))
```
Tests to cover (per spec Testing Guidelines):
- Login form renders email field, password field, submit button
- Signup form renders email field, password field, submit button
- Password field type toggles between `"password"` and `"text"` on toggle click
- Submitting login form with valid data calls `console.log({ email, password })`
- Submitting signup form with valid data calls `console.log({ email, password })`

Additional meaningful tests:
- Toggle button aria-label updates on click
- Email required error appears on empty submit
- Password length error appears when < 5 chars
- Special char error appears when ≥ 5 chars but no special char
- No errors shown for valid input

---

## Files to Modify

### `app/(public)/login/page.tsx`
Replace stub with:
```tsx
import AuthForm from "@/components/AuthForm"
export default function LoginPage() {
  return (
    <div className="center-content">
      <div className="page-content">
        <AuthForm mode="login" />
      </div>
    </div>
  )
}
```

### `app/(public)/signup/page.tsx`
Same structure, `mode="signup"`.

---

## Implementation Order
1. `AuthForm.module.css` → `AuthForm.tsx` → `index.ts`
2. Update `login/page.tsx` and `signup/page.tsx`
3. Write and run `tests/components/AuthForm.test.tsx`

---

## Verification
- Run `npx vitest tests/components/AuthForm.test.tsx` — all tests pass
- Run `npm run build` — no TypeScript or build errors
- Manual: visit `/login`, submit empty → see validation errors; enter valid email + password with special char → see `{ email, password }` in browser console; click switch link → navigates to `/signup`
