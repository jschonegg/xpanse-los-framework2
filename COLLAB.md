# Working on this together

Two designers can work on this prototype in parallel. The codebase is split into views and components, so as long as you each pick different files you won't collide.

## One-time setup

You need [Node.js](https://nodejs.org) installed (LTS version is fine).

```bash
cd ~/Desktop
git clone https://github.com/jschonegg/xpanse-los-framework2.git
cd xpanse-los-framework2
npm install
```

That's it.

## Daily workflow

```bash
# Start of session
git pull
npm run dev       # leaves dev server running at http://localhost:5173
```

The browser auto-reloads when you save a file. No need to refresh manually.

```bash
# Start a new piece of work — always on a branch, never on master
git checkout -b yourname/short-description     # e.g. jordan/hero-redesign

# ...edit files, save, see results in browser...

git add -A
git commit -m "short message describing what changed"
git push -u origin yourname/short-description
```

GitHub will print a Pull Request URL. Open it, write a 1-2 line description, click **Create pull request**.

The other designer reviews, leaves comments or approves, and clicks **Merge pull request** to land it on `master`. Vercel re-deploys automatically.

After merging:
```bash
git checkout master
git pull
git branch -d yourname/short-description   # optional: delete the branch locally
```

## File ownership map

Pick a file when you start. If two of you need the same file, pair on it or split into smaller components first.

### Views — work freely

| File | What it is |
|---|---|
| `src/views/Home.jsx` | LO home dashboard |
| `src/views/ProcessorHome.jsx` | Processor's home |
| `src/views/Pipeline.jsx` | Pipeline (loan table) |
| `src/views/LoanDetail.jsx` | Loan workspace (large — coordinate before big edits) |
| `src/views/NowTab*.jsx` | Stage-specific Now tabs (5 of them — assign one each if both are touching) |
| `src/views/AIFeed.jsx` | AI feed view |
| `src/views/WidgetGrid.jsx` | Configurable home widgets |
| `src/views/URLAView.jsx` | Form 1003 |
| `src/views/LoanEstimateView.jsx` | CFPB Loan Estimate |
| `src/views/LargeDepositReview.jsx` | Specialized doc review |
| `src/views/CommsTab.jsx`, `FileReviewTab.jsx` | Loan-detail subtabs |
| `src/views/LOApprovalView.jsx` | LO approval flow |

### Components — coordinate before editing

These are shared across multiple screens. Ping each other before changing them, especially when adding/renaming props.

| File | Why coordinate |
|---|---|
| `src/components/Shell.jsx` | TopNav + StatusBar + AIFab — every screen renders this |
| `src/components/AIAssistant.jsx` | Floating dock that takes a `ctx` prop and reacts per route |
| `src/components/CommandPalette.jsx` | `⌘K` palette — affects global nav |
| `src/components/Icon.jsx` | Shared icon set — adding new icons here is fine |
| `src/components/PreferencesModal.jsx` | Settings UI |
| `src/components/IncomeTool.jsx`, `DocumentsTool.jsx`, `W2Viewer.jsx`, `BatchIncomeAnalysis.jsx` | In-loan specialized tools |

### Globals — touch carefully

| File | Why |
|---|---|
| `src/styles/tokens.css` | Color/spacing tokens — changes cascade everywhere |
| `src/data/loans.js` | Mock loan data — affects pipeline + every loan-detail screen |
| `src/App.jsx` | Top-level routing — only touch when adding a new route |

## Important conventions

### Branch naming
- `yourname/short-description` (kebab-case)
- e.g. `jordan/loan-detail-eligibility-card`, `melissa/pipeline-saved-views`

### Commit messages
- Imperative, present tense, lowercase: `add eligibility card`, `fix pipeline filter dropdown`
- One concept per commit when possible

### Pull requests
- Title: a clear sentence — `Add eligibility check card to LoanDetail`
- Body: 1-2 bullets on what changed + how to test
- Tag the other designer for review (or just paste the link in Slack)

### Never
- Push directly to `master` (use a branch + PR)
- Force-push (`git push --force`) anything that's been merged or anyone else might have pulled
- Commit `.env`, credentials, or anything that looks like a secret

## Previewing changes

### Locally
`npm run dev` — http://localhost:5173. Hot-reloads on save.

### Sharing a preview before merging
Every PR gets a Vercel preview deployment automatically. Look for the **"Visit Preview"** link on the PR page. Send that URL when you want feedback on a branch without making the other person clone it.

### The live site
Vercel auto-deploys `master` to a fixed URL — that's the always-current production preview. Push to master → live in ~30 seconds.

## When you hit a merge conflict

Conflicts happen when two branches edit the same lines. They look like:

```
<<<<<<< HEAD
your code
=======
their code
>>>>>>> master
```

To resolve:
1. Open the file in your editor
2. Decide what to keep — your version, their version, or both
3. Delete the `<<<`, `===`, `>>>` markers
4. `git add <file>` then `git commit`

When in doubt, **ping the other designer before resolving** — better to align than to guess.

## If something goes wrong

- "I made changes I want to throw away" → `git checkout -- <file>` (per file) or `git restore <file>`
- "I committed to the wrong branch" → don't panic. Ask before doing anything destructive.
- "I can't push because remote has changes" → `git pull --rebase` then `git push`
- "Dev server won't start" → try `rm -rf node_modules && npm install`

## Quick command cheat sheet

```bash
git status                          # what's changed
git diff                            # see exact line changes
git checkout -b yourname/feature    # new branch
git add -A                          # stage everything
git commit -m "message"             # commit
git push -u origin yourname/feature # push & set tracking
git pull                            # grab latest from current branch
git checkout master                 # switch branches
git branch -d yourname/feature      # delete merged local branch
```

Ping each other in chat when in doubt. Better to ask than to merge over each other.
