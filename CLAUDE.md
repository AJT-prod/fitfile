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
- Always run `npm run build` after edits to confirm nothing's broken before considering a task done
- Alex commits and pushes manually (not automated) — this is intentional, part of building git fluency
- Ease off em-dashes and "it wasn't X, it was Y" constructions in any written copy

## Roadmap context
- Phase 2 (next, not started): browser extension that surfaces saved sizes on store product pages
- Backlog: shoe size conversions (US/UK/EU), metric↔imperial helpers, structured jean fields (separate waist + inseam)
