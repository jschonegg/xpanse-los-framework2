# Contributing

## The flow

```
master                 ← always deployable to production
  ↑ merge via PR
  │
  └── yourname/feature-slug   ← work happens here
       │ push → Vercel preview URL appears on the PR
       └── PR → review → merge
```

**Never push directly to `master`.** Master deploys to production on every push, so anything on it should be deployable.

## Day-to-day

```bash
# Start every working session
git checkout master
git pull

# Start a new feature
git checkout -b yourname/feature-slug   # e.g. jordan/login-redesign

# Work, save, commit
git add -A
git commit -m "what changed in 1 sentence"

# Push — Vercel will give this branch its own preview URL
git push -u origin yourname/feature-slug

# Open a PR (link prints when you push, or via gh CLI)
gh pr create --title "Login redesign" --body "Replaces the old centered card with SSO-first layout."

# After review and merge, switch back and pull
git checkout master
git pull
```

## Naming branches

`yourname/short-kebab-slug`. Examples:

- `jordan/hero-severity-tones`
- `melissa/url-form-1003-fixes`
- `jordan/pipeline-filter-chips`

Avoid:

- `feature/login` (no owner)
- `Jordan-Login-Stuff` (camelcase + verbose)
- `fix` (too vague)

## Commit messages

Short, imperative, present tense. Lowercase first letter. One concept per commit when possible.

- ✅ `add severity tone to hero KPI tiles`
- ✅ `fix dangling closing paren in Home.jsx`
- ❌ `Stuff and things`
- ❌ `WIP - login + pipeline + leaderboard`

## Preview URLs

Every push to a branch gets its own Vercel preview URL within ~45 seconds. The URL appears:

- On the PR page (Vercel bot posts a comment)
- In the Vercel dashboard under your project
- Format: `https://ims-los-git-<branch-name>-jschonegg.vercel.app` (or similar)

Use these for sharing work-in-progress with the team without merging.

## When you finish a feature

1. Push the latest changes to your branch
2. Open a PR targeting `master`
3. Title: a clear sentence (under 70 chars)
4. Body: 1-2 lines on what changed + how to test
5. Wait for review (other designer / yourself if solo)
6. Merge via the GitHub UI (the **Merge pull request** button)
7. Production redeploys automatically within ~45 seconds

## Hot-fixing master directly (rare)

If production is broken and you need to fix it RIGHT NOW:

```bash
git checkout master
git pull
# make the fix
git add -A && git commit -m "hotfix: <what>"
git push
```

This bypasses the PR flow. Only do it when production is on fire. Otherwise always use a branch.

## Conflicts

When `git pull` or rebasing surfaces conflicts:

1. Open the file in your editor
2. Look for `<<<<<<<`, `=======`, `>>>>>>>` markers
3. Decide what to keep (your version, their version, or both)
4. Delete the markers
5. `git add <file>` then `git rebase --continue` or `git commit`

If you're unsure, **ping the other designer before resolving** — better to align than guess.

## File ownership map

See `COLLAB.md` for which files are owned by whom and which are shared. Coordinate before editing shared files (`Shell.jsx`, `Icon.jsx`, `tokens.css`, `App.jsx`).
