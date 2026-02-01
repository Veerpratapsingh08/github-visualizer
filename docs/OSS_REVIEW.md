# OSS Usability Review

## Risks for New Users

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Rate limiting confusion** — Users may hit GitHub's 60 req/hour limit and see errors | High | Add clear error message explaining the limit and suggesting smaller repos |
| **Large repo performance** — 3D rendering may lag on 5000+ file repos | Medium | Add warning for large repos, consider progressive loading |
| **No mobile support** — 3D view is unusable on phones | Low | Add "Desktop recommended" notice, or simplified 2D fallback |
| **Unclear entry point** — Landing page doesn't immediately show the tool | Medium | Consider adding live demo embed or GIF on landing |

## Risks for Contributors

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Complex 3D code** — React Three Fiber has a steep learning curve | High | Clearly mark which files require 3D knowledge |
| **No tests** — Contributors may accidentally break things | High | Add basic tests, or document manual testing steps |
| **Unclear folder structure** — features/ vs components/ distinction | Low | Document in CONTRIBUTING.md (done) |

## Suggestions to Improve Discoverability

1. **Add GitHub Topics** — When publishing, add topics like: `visualization`, `git`, `learning`, `three-js`, `nextjs`, `developer-tools`

2. **Add Open Graph image** — Create a social preview image for GitHub so links look good when shared

3. **Demo link in repo description** — Deploy to Vercel and add the live URL to the repo "About" section

4. **GIF in README** — A 5-second GIF showing the visualization is worth 1000 words

5. **"Try it now" repos** — Pre-populate sample repos (facebook/react, pmndrs/zustand) for one-click demos

## Priority Actions

1. ⚡ Add live demo link
2. ⚡ Add hero GIF/video to README
3. ⚡ Improve rate limit error messaging
4. 📌 Add basic smoke tests
5. 📌 Add Open Graph metadata
