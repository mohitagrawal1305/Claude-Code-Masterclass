# Spec for auth-state-management

branch: claude/feature/auth-state-management

## Summary

Implement a global authentication state management solution that exposes the current Firebase user via a `useUser` hook. The hook returns `null` when logged out and the user object when logged in. This state should be driven by a real-time Firebase Auth listener so any page or component always reflects the up-to-date auth status without manual refreshes.

## Functional Requirements

- A React context (`AuthContext`) wraps the app at the root layout level and subscribes to Firebase Auth's `onAuthStateChanged` listener.
- The context holds the current user (`User | null`) and a loading flag (`boolean`) indicating whether the initial auth check is still in progress.
- A `useUser` hook is exported and usable in any page or component to read `{ user, loading }`.
- When Firebase Auth emits a change, all subscribers automatically re-render with the new user value.
- The listener is cleaned up (unsubscribed) when the provider unmounts.
- Any existing components that already access user data should be updated to use `useUser` instead of their current approach.

## Figma Design Reference (only if referenced)

N/A

## Possible Edge cases

- Initial render before Firebase has resolved auth state — `loading` should be `true` during this window so consumers can show a loading state rather than incorrect UI.
- User session expiry or token revocation mid-session — the listener should automatically update the user to `null`.
- `useUser` called outside of `AuthProvider` — should throw a clear error message rather than silently returning undefined.
- Multiple components mounting and unmounting while auth state is loading — the single shared listener (at the provider level) should prevent duplicate subscriptions.

## Acceptance Criteria

- `AuthProvider` is mounted in the root layout so every page has access to auth state.
- `useUser()` returns `{ user: User | null, loading: boolean }`.
- `loading` is `true` until the first `onAuthStateChanged` callback fires, then `false` thereafter.
- After login (handled elsewhere), `useUser().user` reflects the logged-in user without a page reload.
- After logout (handled elsewhere), `useUser().user` returns `null` without a page reload.
- Any component previously reading user state directly has been refactored to use `useUser`.
- No prop-drilling of user data is required anywhere in the component tree.

## Open Questions

- Should `loading` remain `true` on subsequent auth changes (e.g. token refresh) or only on initial load? on initial load, keep a seperate variable for subsequent like isupdating
- Is there a need to expose a `refetchUser` / `reload` method from the hook for forced refreshes? yes

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- `useUser` returns `{ user: null, loading: true }` before auth state resolves.
- `useUser` returns `{ user: mockUser, loading: false }` after auth state resolves with a logged-in user.
- `useUser` returns `{ user: null, loading: false }` after auth state resolves with no user.
- Calling `useUser` outside of `AuthProvider` throws an error with a descriptive message.
- Auth state change (e.g. login then logout) causes components consuming `useUser` to re-render with updated values.
