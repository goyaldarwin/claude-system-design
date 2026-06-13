# Resume working on this course

Paste the block below into a fresh Claude Code session started from this repo folder, fill in the
`TODAY I WANT TO:` line, and go.

---

```
I'm resuming work on my self-hosted system-design learning course.

CONTEXT
- Repo: /Users/darwin/Personal-Unsynced/github-pages/claude-system-design (git branch: main)
- Live (public GitHub Pages): https://goyaldarwin.github.io/claude-system-design/
- GitHub account that owns it: goyaldarwin (NOT darwingoyal). SSH key = id_rsa, loaded via my
  `ssh-add-darwin` shell alias. Remote is SSH: git@github.com:goyaldarwin/claude-system-design.git
- It's a 72-lesson static HTML course (no build step): lesson files "NN Title.htm" at repo root,
  index.html landing page, shared assets in _principal_files/ (lesson.css, nav.js, sidebar.html,
  favicon.svg, img/, bytebytego/). A .nojekyll file is required (GitHub Pages/Jekyll drops
  underscore folders without it — don't delete it).

STRUCTURE / CONVENTIONS (keep consistent if adding/editing)
- Every page: <div class="layout"> + the full <nav class="sidebar"> (identical on all pages, the
  current page's link has class="lk active") + <div class="main"><div class="wrap">CONTENT</div></div></div>.
  The canonical sidebar lives in _principal_files/sidebar.html — regenerate it and push into all
  pages when lessons change.
- New lessons use clean self-contained HTML linking ./_principal_files/lesson.css + nav.js + favicon.
  Callout classes: .callout note/warn/ok/tradeoff; deep dives use .pdeep; self-tests use .mastery.
- This is LEARNING material, not interview prep — never use "interview/candidate/interviewer/hiring"
  in visible text or filenames (technical terms like Raft "candidate" are fine).
- Links: bare relative filenames with literal spaces (e.g. href="04 Caching.htm"). Two hubs index
  every lesson: index.html and "63 Principal-Level Self-Assessment and Index.htm" — update both when
  adding lessons.

HOW I WORK
- Use background Workflows to author/edit many lessons in parallel; validate with a Python pass
  (div balance excluding <pre>, sidebar+active count, all links/images resolve, both hubs index all
  lessons, no interview words) BEFORE committing.
- A security hook blocks you from touching my SSH key path, so YOU (me) run the push:
  `ssh-add-darwin` then `git push`. Everything else (author, validate, commit) you can do.
- After pushing, GitHub Pages rebuilds in ~1 min; hard-refresh to bypass cache.

TODAY I WANT TO: <describe the change — e.g. "add a dark-mode toggle", "add lesson 73 on X",
"rename files to clean URL slugs", "review lesson NN for depth">

Start by reading _principal_files/sidebar.html and one recent lesson (e.g. "38 Storage Engines LSM vs B-Tree.htm")
to re-learn the exact template, then propose a plan before making changes.
```

---

## Quick reference

- **Course sections:** Fundamentals (01–14) · Classic design problems (15–29) · Distributed systems
  theory (30–36) · Data-intensive (37–42) · Modern architecture (43–46) · Reliability & ops (47–51) ·
  Security (52) · Advanced design problems (53–62, 66) · Architecture & tech choices (67–70) ·
  Applied & cross-cutting (71–72) · Self-assessment & index (63). Plus extras: Search (64), Object
  Storage & CDN (65).
- **Edit → publish loop:** make changes → validate → `git add -A && git commit -m "..."` →
  `ssh-add-darwin` → `git push` → wait ~1 min → hard-refresh the live URL.
- **Add a lesson checklist:** create the .htm in the page template; add it to `_principal_files/sidebar.html`;
  re-push the sidebar into every page; add it to both hubs (index.html + lesson 63); validate; commit; push.
