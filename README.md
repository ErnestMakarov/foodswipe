# ERNEST — Food Discovery

An independent, mobile-first food discovery prototype exploring a simple idea: help people who are hungry but don't know what to order discover suitable dishes faster.

## Prototype features

- Preference setup with a maximum budget and food exclusions
- Swipe-style discovery cards with keyboard/button controls and pointer dragging
- Like / skip decisions and a saved shortlist
- Responsive layouts for mobile and desktop
- Local demo data only; no Bolt Food integration, live restaurant availability, accounts, or checkout

## Tech stack

React, TypeScript, Vite, React Router, Tailwind CSS v4, Lucide icons.

## Run locally

```bash
npm install
npm run dev
```

Check the production build and lint:

```bash
npm run build
npm run lint
```

## Disclaimer

ERNEST is an independent concept prototype and is not affiliated with, endorsed by, or an official product of Bolt Food. Restaurant names, dishes, prices and availability in the demo are illustrative.


## Deploying to Vercel

Import this repository into Vercel and keep the default Vite settings (build command `npm run build`, output directory `dist`). The included `vercel.json` rewrite supports client-side routes when a user opens or refreshes a route directly.

The discovery card supports touch swipes on phones and tablets. On desktop, use the visible Skip and Like buttons for predictable interaction. The footer includes a compact link to Ernest's portfolio contact page.
