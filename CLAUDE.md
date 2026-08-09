# FitFile — Project Memory

## What this is
A web app for recording clothing sizes and body measurements, organized by store. Live at https://myfitfile.netlify.app. Repo: AJT-prod/fitfile.

## Core philosophy — read this before making product decisions
FitFile is memory, not authority. It never tells the user what size they should be — it only remembers what they already know. Every design and feature decision should be checked against this. When in doubt, favor the simpler, more permissive option.

## Stack
- React + Vite, React Router v6
- `localStorage` only — no backend, no accounts, no auth
- Styling is inline `style={{}}` objects per-component (no CSS framework, no Tailwind). Shared hover/active states live in `src/index.css` since inline styles can't do `:hover`.
- Deployed via Netlify, auto-deploys on push to `main`

## Design system
- Palette: Blue 400 `#378ADD` (primary actions/navigation), Green `#EAF3DE` bg / `#3B6D11` text / `#C0DD97` border (positive/add actions), Amber `#FAEEDA` bg / `#854F0B` text / `#FAC775` border (notes/warmth), Gray 50 `#F1EFE8` (page background)
- Cards: white bg, `0.5px solid #D3D1C7` border, `12px` border-radius, soft shadow (`0 1px 2px rgba(44,44,42,0.04), 0 4px 14px rgba(44,44,42,0.04)`)
- Type: system sans-serif, only weights 400 and 500
- Tone: calm, confident, warm minimalism, generous whitespace

## Product decisions worth knowing (don't relitigate without discussion)
- All fields optional, nothing required — trust the user
- Freeform text for sizes (not rigid dropdowns), with placeholder guidance
- No weight field — body-neutral by design, intentionally excluded
- Notes live at the store level only, not per-category
- App always opens to Home

## Data model (localStorage keys)
- `fitfile_core_sizes` — general defaults: tops, bottoms, outerwear, jeans, dresses, shoes, bra, underwear, socks
- `fitfile_measurements` — height, chest, waist, hips, inseam, shoulder, sleeve, neck, thigh, each `{ in, cm }`
- `fitfile_stores` — array of `{ id, name, notes, sizes: { [category]: string, custom: [{label, value}] } }`
- `fitfile_last_updated_coreSizes` / `fitfile_last_updated_measurements` — `{ label, value }` for Home screen summary

## Workflow
- Alex prefers reacting to a concrete draft/diff over building from scratch — show the change, don't just describe it
- A pre-commit hook (`.githooks/pre-commit`) runs `npm run build` automatically and blocks the commit if it fails. One-time setup per clone: `git config core.hooksPath .githooks`
- Alex commits and pushes manually (not automated) — this is intentional, part of building git fluency. The pre-commit hook is a safety net on top of that, not a replacement for it — Alex still decides what to commit and when to push
- Ease off em-dashes and "it wasn't X, it was Y" constructions in any written copy

## Roadmap context
- Sequencing decision (Aug 2026): backlog before Phase 2. Structured jean fields change the data model (`sizes.jeans` goes from a string to an object), so settling that before the extension exists avoids updating both the app and the extension later. Shoe conversions and the metric/imperial helper also make Phase 2 more useful on day one — the extension can convert a saved size to the site's region/units instead of just echoing back a raw string.
- Backlog (do first, in this order):
  1. Structured jean fields — separate waist + inseam instead of one freeform string
  2. Metric ↔ imperial conversion helpers (reusable utility, not just the measurements screen)
  3. Shoe size conversions (US/UK/EU, Men's/Women's)
- Phase 2 (after backlog, not started): browser extension that surfaces saved sizes on store product pages, built on top of the settled data model and reusing the conversion helpers above
