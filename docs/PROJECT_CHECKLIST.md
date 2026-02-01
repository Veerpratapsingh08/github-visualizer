# Project Hygiene Checklist

## Files That Should Exist ✅

| File | Status | Purpose |
|------|--------|---------|
| `README.md` | ✅ Created | Project overview, setup, features |
| `LICENSE` | ✅ Created | MIT License |
| `CONTRIBUTING.md` | ✅ Created | How to contribute |
| `.gitignore` | ✅ Exists | Ignore node_modules, .next, etc. |
| `package.json` | ✅ Exists | Dependencies and scripts |
| `tsconfig.json` | ✅ Exists | TypeScript configuration |
| `.github/ISSUE_TEMPLATE/bug_report.md` | ✅ Created | Bug report template |
| `.github/ISSUE_TEMPLATE/feature_request.md` | ✅ Created | Feature request template |
| `.github/PULL_REQUEST_TEMPLATE.md` | ✅ Created | PR checklist |

## Files to Add Before Release

| File | Priority | Purpose |
|------|----------|---------|
| `docs/screenshots/hero.png` | High | README hero image |
| `docs/screenshots/treemap.png` | High | Visualization screenshot |
| `docs/screenshots/terminal.png` | High | Git learning screenshot |
| `.env.example` | Low | Document env vars (if any) |
| `CHANGELOG.md` | Low | Track releases (optional for v1) |

## Repo Structure ✅

Current structure is good:
```
github-visualizer/
├── src/
│   ├── app/           # Pages (Next.js App Router)
│   ├── features/      # Feature-specific code
│   └── components/    # Shared components (if needed)
├── public/            # Static assets
├── docs/              # Documentation and screenshots
├── .github/           # GitHub templates
└── [config files]     # package.json, tsconfig, etc.
```

## Naming Consistency Check

| Current | Issue | Recommendation |
|---------|-------|----------------|
| `CityScene.tsx` | Name implies "city" but now it's a treemap | Consider renaming to `TreemapScene.tsx` |
| `CityBuilder.tsx` | Same as above | Consider renaming to `TreemapBuilder.tsx` |
| `buildCityTree` export | Legacy compat | Keep alias, document deprecation |

**Verdict**: Keep current names for now. They work and aren't user-facing. Rename is a good v2 task.

## Before Publishing Checklist

- [ ] Take 3 screenshots and add to `docs/screenshots/`
- [ ] Deploy to Vercel
- [ ] Add Vercel URL to GitHub repo "About" section
- [ ] Add GitHub Topics: `visualization`, `git`, `learning`, `three-js`, `react`, `nextjs`
- [ ] Create a release tag (v1.0.0)
- [ ] Share on Twitter/X, Reddit r/webdev, HackerNews

## Optional Enhancements

- [ ] Add GitHub Actions for CI (lint on PR)
- [ ] Add Codecov badge (if tests exist)
- [ ] Add "Deploy to Vercel" button in README
- [ ] Create a demo GIF using screen recording
