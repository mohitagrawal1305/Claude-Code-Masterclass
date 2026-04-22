# Spec for Heist Card Component

branch: claude/feature/heist-card-component

## Summary

Build a `HeistCard` component and a `HeistCardSkeleton` loading placeholder. The `/heists` dashboard page should display active and assigned heists in a responsive 3-column grid using these cards. Each card title links to the heist detail page (`/heists/:id`). Expired heists must be excluded from the list. The skeleton must match the card's layout and be shown while heists are loading.

## Functional Requirements

- Fetch all heists from the Firestore `heists` collection that belong to the current user (either as `createdBy` or `assignedTo`)
- Filter out expired heists — a heist is considered expired if its `dueDate` is in the past (if `dueDate` is null, treat it as active)
- Display the filtered heists in a 3-column grid layout on the `/heists` page
- Each `HeistCard` must display:
  - **Title** — links to `/heists/:id` (Next.js `<Link>`)
  - **Description** — truncated to 2–3 lines if long
  - **Assigned to** — show the assignee's codename (look up from `users` collection using `assignedTo` user ID)
  - **Due date** — human-readable format (e.g. "Apr 28, 2026"), or "No deadline" if null
  - **Status badge** — "Active" or "Assigned" depending on whether the current user is the creator or the assignee
- While heists are loading, render the same 3-column grid filled with `HeistCardSkeleton` placeholders (show 6 skeletons)
- The `/heists/:id` detail page should exist as a route but render no content yet (empty shell page only)
- If there are no active/assigned heists, show an empty state message encouraging the user to create their first heist

## Figma Design Reference (only if referenced)

- File: https://www.figma.com/design/elHzuUQZiJXNqJft57oneh/Page-Designs?node-id=54-60&m=dev
- Component name: Heist Card (node 54-60)
- Design reference could not be retrieved automatically — see Figma manually for exact measurements
- Based on existing project tokens, the card will likely use:
  - Card background: `bg-light` (`#0A101D`) with `bg-lighter` for nested elements
  - Title: `text-heading` (white), body text: `text-body` (`#99A1AF`)
  - Status badge accent: `text-primary` (`#C27AFF`) for active, `text-secondary` (`#FB64B6`) for assigned
  - Due date / metadata: `text-body` small
  - Border radius consistent with existing components (`rounded-xl`)

## Possible Edge Cases

- A heist may have `assignedTo` and `createdBy` as the same user — show "Active" status in this case
- The `dueDate` field may be `null` — treat as active (no deadline), show "No deadline"
- Assignee's codename lookup may fail if the user document no longer exists — fall back to "Unknown agent"
- The heist list may be empty after filtering — show the empty state
- A heist may have a very long title or description — truncate gracefully without breaking the grid layout
- Loading state should not flash if data loads very quickly — consider a minimum display time or smooth transition

## Acceptance Criteria

- [ ] `HeistCard` component renders title, description, assignee codename, due date, and status badge
- [ ] Card title is a Next.js `<Link>` pointing to `/heists/:id`
- [ ] `/heists` page shows only active and assigned heists (not expired)
- [ ] Expired heists (past `dueDate`) are excluded from the displayed list
- [ ] Heists are displayed in a 3-column responsive grid
- [ ] `HeistCardSkeleton` matches the `HeistCard` layout and is shown during loading (6 placeholders)
- [ ] After loading completes, skeletons are replaced by real cards (or empty state)
- [ ] Empty state message is shown when no active/assigned heists exist
- [ ] `/heists/:id` route exists and renders without errors (content is a placeholder for now)

## Open Questions

- Should the 3-column grid collapse to fewer columns on smaller screens (tablet/mobile)?
- Should "Assigned" and "Active" be the only two statuses, or will more be added later (e.g. "Completed", "Overdue")?
- Should the current user see heists they created AND heists assigned to them in the same list, or separate sections?
- Is the assignee codename looked up client-side per card, or should heist documents be denormalised to include the codename directly?
- Should clicking the card (not just the title) navigate to the detail page?

## Testing Guidelines

Create test files at `tests/components/HeistCard.test.tsx` and `tests/components/HeistCardSkeleton.test.tsx`. Cover the following cases without going too heavy:

- `HeistCard` renders the title, description, assignee, and due date
- Card title renders as a link pointing to `/heists/<id>`
- "Active" badge is shown when the current user is the creator
- "Assigned" badge is shown when the current user is the assignee
- "No deadline" is shown when `dueDate` is null
- `HeistCardSkeleton` renders the expected number of placeholder elements to match the card layout
- `/heists` page renders 6 skeletons while loading
- `/heists` page renders cards after data is loaded
- `/heists` page renders the empty state when there are no active/assigned heists
- Expired heists are not rendered on the `/heists` page
