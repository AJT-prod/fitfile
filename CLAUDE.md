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
- Blue also carries a second meaning: "FitFile is pointing this out" — used for highlighted matches (e.g. a likely store match), for values that override a general default (e.g. a store-specific size that differs from Core Sizes), and for recommended presets (e.g. "Everyday essentials"). Blue 50 bg / Blue 200 border / Blue 800-900 text. Kept distinct from amber, which stays reserved for actual note content.
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
- `fitfile_core_sizes` — general defaults: tops, bottoms, outerwear, jeans `{ waist, inseam }`, dresses, shoes `{ size, system }` (system is `usWomen`/`usMen`/`uk`/`eu`), bra `{ band, cup }`, underwear, socks
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
- Backlog — done:
  1. ✅ Structured jean fields — separate waist + inseam instead of one freeform string
  2. ✅ Metric ↔ imperial conversion helpers — `src/utils/conversions.js`, reused by the Measurements screen
  3. ✅ Shoe size conversions (US/UK/EU, Men's/Women's) — Core Sizes shoes field has a size input + system toggle, shows the other three systems inline
  4. ✅ Bra size conversions (bonus, added alongside shoe sizes) — Core Sizes bra field split into Band + Cup, shows UK/EU equivalents inline
  - Also shipped: a standalone `/size-guide` reference page with static shoe, apparel, and bra conversion charts
- Phase 2 (design in progress, implementation not started): browser extension that surfaces saved sizes on store product pages, built on top of the settled data model and reusing the conversion helpers in `src/utils/conversions.js`. Extensive design decisions made — see below. Sync architecture is the next thread, deliberately spun into its own conversation.

## Phase 2 design decisions

**Store matching**
- Store matching (Aug 2026): the extension will match a browsed site to a saved store through user-driven search/selection, not an automatic domain field on the store record. Reasoning: many store domains don't match their display name (e.g. Old Navy → oldnavy.gap.com, Banana Republic → bananarepublic.gap.com), so a stored domain field would need constant upkeep and could silently surface the wrong store's sizes if it drifted out of date or matched a subdomain/regional TLD incorrectly — that cuts against "nothing is inferred." No change to the `fitfile_stores` data model needed for this.
- Possible later enhancement (not required for v1): client-side fuzzy-match the current tab's title/hostname against saved store names to pre-highlight the likely match at the top of the search results. Computed at read-time in the extension, no schema change — the user still confirms or picks a different store.
- Store search behavior (Aug 2026): tapping "match a store" always opens the full searchable list, never jumps straight into a suggested store's data. The suggested/likely match is pre-highlighted at the top of the list (blue treatment) so it's fast to confirm with one tap, but confirmation stays required — consistent with why store matching is user-driven search in the first place, not automatic detection.
- No store-selection persistence in v1 (Aug 2026, deliberate): closing the popup or switching tabs does not remember the last selected store — every popup open starts at the default Core Sizes view. Known tradeoff: browsing multiple pages on the same site in one session means re-searching each time. Intentionally left for a planned future "remember store" feature rather than solved now, to avoid tackling persistence and store-matching UI at the same time.

**Permissions**
- Permission scope (Aug 2026): extension starts with `activeTab` only — it does nothing until the user clicks the toolbar icon, which grants temporary access to just the current tab. No install-time "read and change all your data on all websites" warning, no background script watching every page. Matches the same user-driven-confirmation posture as store matching — the extension acts on request, it doesn't infer when to activate.
- Optional per-site persistence (Aug 2026, deferred — not required for v1): `optional_host_permissions` can later let a user opt in per-domain ("Always run on this site?") via `chrome.permissions.request()`, persisting access to specific origins they choose one at a time, rather than a maintained domain list (avoids the same staleness problem ruled out in the store-matching decision). This is additive on top of the activeTab version, not a rewrite — keep the tab-reading/store-matching logic in its own function, separate from what triggers it (click vs. persisted permission), so the opt-in layer can reuse it later without touching the core logic. Ship activeTab-only first; revisit only if click-to-activate proves to be real friction in practice.

**Popup structure**
- Popup default state (Aug 2026): the extension popup opens straight to Core Sizes, no store selection required — most stores run normal, so the user's general defaults are the useful default view. Store selection is optional and narrows things down, not a required first step.
- Store view is a merge, not a swap (Aug 2026): selecting a store doesn't replace the view with only that store's saved fields — it merges the store's data over Core Sizes, since a store record is meant to capture outliers (sizes that differ from usual), not duplicate every field. Fields with no store-specific entry keep showing the user's general default.
- Override visual treatment (Aug 2026): fields where a store overrides the general default are marked with light blue (see Design system) — the same accent used for the store-search "likely match" highlight.
- Custom fields render neutral, not override-styled (Aug 2026): a store's custom fields (`sizes.custom`) sit in the same neutral styling as un-overridden core fields, not the blue override treatment — a custom field isn't correcting a general default (there isn't one to correct), it's purely additive, so giving it override styling would misrepresent what it's doing.
- Hidden override alert (Aug 2026): a user's hide preference (category unchecked from their popup view — see Scope of what's shown) wins by default — a hidden category stays hidden even if the selected store has a genuine override recorded for it. But a short inline notice surfaces the gap rather than silently dropping it, e.g. "Old Navy has 1 size not shown." Keeps "trust the user" intact on both sides: their display choice is respected, and nothing is invisibly withheld.

**Scope of what's shown**
- Scope of what's shown (Aug 2026): both Core Sizes and Measurements displays in the popup are user-configurable, not fixed by FitFile. Recommended groups ("Everyday essentials" / "Full wardrobe" for Core Sizes, mirrored groupings for Measurements, e.g. a "tailoring basics" preset) are starting points the user can still edit, not locked selections — consistent with "recommendation, not requirement" everywhere else in the app.
- Auto-default, no required first-run screen (Aug 2026): on install, "Everyday essentials" is applied automatically so the popup is useful with zero setup steps. The settings screen (category checklist) is the same surface for both first-time configuration and later changes — reachable via a gear icon, never gating first use. Gear icon carries a native `title` attribute (e.g. "Change what's shown") for the hint — no custom tooltip, coach-mark, or first-time-only UI, since that adds real implementation weight for a hint most users need once if at all.
- Settings live in the extension, not the FitFile app (Aug 2026): display preferences (which categories show in the popup) are extension-owned (`chrome.storage`), not synced from or editable in the FitFile app. Keeps the app's scope exactly what it's always been — recording what the user knows — rather than picking up a concern (extension display prefs) that has nothing to do with sizing data. The tradeoff: this preference is only visible/editable while using the extension, not from the main app.

**Empty / edge states**
- No core sizes saved yet: "Nothing saved yet. Add your core sizes to get started." with a link back to the FitFile app. (Avoid "please" in UI copy — reads as the interface asking a favor rather than stating what's next.)
- Store selected with no store-specific data: an explicit note clarifies these are the user's usual sizes, not this store's data (e.g. "No store-specific data for [store], so these are your usual sizes") — without this, a sparse store record could look like the popup failed to load something.
- Sync status states (Aug 2026): a lightweight "Syncing in progress…" state covers the normal case. If sync never completes (first-ever use, or a stalled/failed sync), a fallback state applies — "Couldn't sync. Open FitFile to try again." with a button back to the app — using the same layout shape (icon, headline, subtext, button) as the empty-core-sizes state, since both are "nothing to show yet, here's what to do" moments.

**Constraints for sync architecture thread (Aug 2026, not yet designed — requirements gathered from decisions above, for a dedicated future conversation to design against)**
- Must support an observable "syncing in progress" state and a distinct "sync failed / never synced" state — the popup UI already has copy and layout built for both (see Sync status states above).
- chrome.storage needs to cleanly separate two kinds of data: mirrored FitFile data (core sizes, measurements, stores) vs. extension-only display preferences (which categories show, settings). These likely shouldn't live in the same blob, since one is synced from FitFile and the other is extension-native and never touches the app.
- Whatever triggers a sync (on FitFile visit, manual button, interval) needs to be explicit enough to drive the "syncing in progress" UI honestly — not a silent background process the popup can't report on.
- Should leave room for the deferred optional-per-site-permissions feature to persist its own state later (which sites have been granted persistent access) without requiring a rework of however sync/storage gets structured now.
