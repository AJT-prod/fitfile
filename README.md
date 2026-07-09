# FitFile

**Your sizes stored. Store to store.**

FitFile is a web app for tracking your clothing sizes and body measurements, organized by store. It doesn't calculate what size you *should* be — it just remembers what you already know.

🔗 **Live app:** [myfitfile.netlify.app](https://myfitfile.netlify.app)

## Why

Most sizing apps try to predict your size using AI or body scanning. FitFile doesn't. It's a personal sizing address book — you tell it your Uniqlo top is a size S and runs small, and it remembers that for next time. No algorithm, no accounts, no judgment.

## Design principles

- **Trust the user.** Every field is optional. Nothing is required, nothing is inferred.
- **Freeform over rigid.** Sizes are entered as free text with placeholder guidance (e.g. "31x30" for jeans), not locked dropdowns — because sizing isn't standardized across stores anyway.
- **Body-neutral by design.** No weight tracking. This app is memory, not authority.
- **Private by default.** All data lives in your browser's `localStorage`. No backend, no accounts, nothing leaves your device.

## Features

- Core sizes — your general defaults across tops, bottoms, jeans, dresses, shoes, and more
- Body measurements — stored in both inches and centimeters, auto-converted, always editable
- Store-specific sizing — save sizes per store with notes on fit (e.g. "runs small — size up")
- Custom size categories for anything that doesn't fit the standard list

## Tech stack

- React + Vite
- React Router v6
- `localStorage` for persistence (no backend)
- Deployed on Netlify via GitHub auto-deploy

## Running locally

```bash
git clone https://github.com/AJT-prod/fitfile.git
cd fitfile
npm install
npm run dev
```

## Roadmap

- **Phase 2:** Browser extension that surfaces your saved sizes while shopping on clothing store product pages
- Shoe size conversions (US / UK / EU)
- Metric ↔ imperial conversion helpers

## Background

FitFile was built solo, with Claude as a development partner throughout — from product decisions down to debugging. It's documented as a full case study on my portfolio: *[https://app.prodfolio.io/p/alex/case-study/new-case-study-3]*