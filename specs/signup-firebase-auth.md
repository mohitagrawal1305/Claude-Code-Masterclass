# Spec for signup-firebase-auth

branch: claude/feature/signup-firebase-auth

## Summary

Wire the existing signup form (`app/(public)/signup/`) to Firebase Authentication using the Firebase web SDK. On successful account creation, generate a random PascalCase codename (three words joined together) and set it as the user's `displayName`. Also create a document in the Firestore `users` collection storing the user's `id` and `codename` — no email stored.

## Functional Requirements

- The signup form submits email and password to Firebase Auth via `createUserWithEmailAndPassword`
- On success, generate a random codename by picking one word from each of three distinct word sets and joining them in PascalCase (e.g. `SilentGoldenFox`)
- The word sets must be unique per set (no duplicates within a set), and the three sets must be clearly distinct categories (e.g. adjective, colour, animal)
- Set the generated codename as the Firebase user's `displayName` via `updateProfile`
- Create a document in the Firestore `users` collection with:
  - `id`: the Firebase UID
  - `codename`: the generated PascalCase display name
  - No email field
- On error (e.g. email already in use, weak password), display a user-facing error message in the form
- After successful signup, redirect the user to `/heists`
- Use only the Firebase web SDK (`firebase/auth`, `firebase/firestore`) — no server-side calls

## Figma Design Reference (only if referenced)

N/A

## Possible Edge cases

- Email already registered — Firebase returns `auth/email-already-in-use`; show a clear inline error
- Weak password rejected by Firebase — surface the error message to the user
- Firestore write fails after Auth account is created — the user is authenticated but has no `users` doc; should be surfaced as an error without blocking the redirect (log the failure)
- Codename collision in Firestore — not a blocker since `id` is the primary key; codename uniqueness is not enforced
- Network offline during signup — show a generic error and do not redirect

## Acceptance Criteria

- Submitting valid credentials creates a Firebase Auth user
- The created user's `displayName` equals a PascalCase string composed of one word from each of the three word sets
- A document exists in `users/{uid}` with fields `id` and `codename` matching the above, and no `email` field
- Submitting a duplicate email shows an inline error without crashing
- Successful signup redirects to `/heists`
- The word generation logic is pure and unit-testable (no Firebase dependency)

## Open Questions

- Should the codename be re-rolled if it happens to match an existing one, or is uniqueness not required? no
- If the Firestore write fails, should signup be treated as fully successful or partially failed?log the error

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- `generateCodename` returns a string in PascalCase composed of exactly three words (one from each set)
- `generateCodename` returns different values across multiple calls (probabilistic, run a few times)
- Signup form: submitting valid data calls `createUserWithEmailAndPassword` with the correct email and password
- Signup form: on success, `updateProfile` is called with a non-empty `displayName`
- Signup form: on success, Firestore `setDoc` is called with `id` and `codename` fields and no `email` field
- Signup form: on `auth/email-already-in-use` error, an error message is displayed in the UI
- Signup form: on success, the user is redirected to `/heists`
