---
description: Create a commit message by analyzing git diffs
allowed-tools: Bash(git status:*), Bash(git diff --staged), Bash(git commit:*)
---

## Context
- Current git status: !`git status`
- Current git diff: !`git diff --staged`

## Your task:
Analyze above staged git changes and create a commit message. use present tense and explain "why" something has changed, not just "what" has changed.

## Commit types with emojis:
Only use the following emojis:

- `feat:` - New feature
- `fix:` - Bug fix
- `refractor:` - Refractoring code
- `docs:` - Documentation
- `test:` - Tests
- `perf:` - Performance

```
<type>: <concise_description>
<optional_body_explaining_why>
```

## Output:
1. Show summary of changes currently staged
2. Ask for confirmation before committing

DO NOT auto-commit - wait for user approval, and only commit if the user says so.