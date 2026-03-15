# Spec for auth-forms

branch: claude/feature/auth-forms

## Summary
Add authentication forms to the `/login` and `/signup` pages. Each form collects an email address and password, with a toggle to show/hide the password. On submission, form data is logged to the console. Users can switch between the two forms via a link.

## Functional Requirements
- The `/login` page renders a form with an email field, a password field, and a "Log in" submit button
- The `/signup` page renders a form with an email field, a password field, and a "Sign up" submit button
- Each password field has a show/hide toggle icon that reveals or masks the password text
- Submitting either form logs the form values (email, password) to the browser console — no API call required
- Each page includes a link to switch to the other form (e.g. "Don't have an account? Sign up" on login, and vice versa)

## Figma Design Reference (only if referenced)
- N/A

## Possible Edge cases
- User submits the form with empty fields — client-side validation should prevent submission and indicate required fields
- User toggles show/hide password multiple times rapidly — toggle state should remain accurate
- Long email addresses or passwords should not break the layout

## Acceptance Criteria
- `/login` renders email input, password input, show/hide toggle, and a submit button
- `/signup` renders email input, password input, show/hide toggle, and a submit button
- Submitting a form with valid values logs `{ email, password }` to the console
- The password is masked by default and revealed only when the toggle is active
- A link on `/login` navigates to `/signup` and vice versa
- Both forms are responsive and use project theme colors

## Open Questions
- Should the signup form require a confirm-password field in the future?
- Should there be any minimum password length validation now, or deferred until real auth is added? Minimum 5 char with atleast 1 special char.

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Login form renders email field, password field, and submit button
- Signup form renders email field, password field, and submit button
- Password field type toggles between "password" and "text" when the show/hide icon is clicked
- Submitting the login form calls console.log with the entered email and password
- Submitting the signup form calls console.log with the entered email and password
