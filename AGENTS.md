<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

This repository is the QuBit institutional site and lead-generation app. The product is in Brazilian Portuguese, but code identifiers and file names stay in English.

## Start here

- [README.md](README.md)
- [CLAUDE.md](CLAUDE.md)
- [content/copy.ts](content/copy.ts)
- [styles/tokens.css](styles/tokens.css)

## Stack and workflow

- Next.js 16 + React 19 + TypeScript + Tailwind CSS v4
- PostgreSQL access via the app's server-side/database layer in [db](db) and [lib](lib)
- Form validation uses Zod and React Hook Form
- 3D experiences use @react-three/fiber and drei
- Local commands:
  - `npm run dev`
  - `npm run build`
  - `npm run lint`

## Project conventions

- Use Brazilian Portuguese copy and UX copy. Do not invent pricing, legal text, partner names, colors, or metrics.
- The source of truth for content and pricing is [content](content); the source of truth for visual tokens is [styles/tokens.css](styles/tokens.css).
- Do not add magic values in JSX. Prefer design tokens or existing Tailwind classes.
- The primary CTA uses `bg-brand` and the label color must be `text-paper`; avoid using black text on blue buttons.
- Use sentence case across the UI; avoid all caps except the logo treatment.
- Respect `prefers-reduced-motion` in all animations and keep interactive targets at least 44px tall/wide.
- Accessibility is part of acceptance: semantic markup, focus states, labels, and keyboard support are required.
- Reuse existing components before creating new patterns. The main component families live under [components](components).

## Architecture

- [app](app) defines the route structure and page composition.
- [components](components) contains layout, UI, home sections, and 3D universe features.
- [content](content) stores copy/content objects, FAQs, services, and partner placeholders.
- [lib](lib) stores validation helpers and shared logic.
- [public](public) stores brand assets and static files.

## Files to check before editing

- [app/page.tsx](app/page.tsx)
- [components/layout/Header.tsx](components/layout/Header.tsx)
- [components/ui/Button.tsx](components/ui/Button.tsx)
- [components/ui/Field.tsx](components/ui/Field.tsx)
- [lib/validation.ts](lib/validation.ts)
- [app/api/diagnostico/route.ts](app/api/diagnostico/route.ts)

## Guardrails

- Do not create placeholder marketing copy when real content exists in [content](content).
- Do not hardcode WhatsApp numbers, GA IDs, or env-backed settings into the UI without checking the existing pattern.
- Do not bypass the existing token system or design rules for colors, spacing, or buttons.
- Prefer existing route conventions and component composition rather than introducing new app structure patterns.
- When working in the 3D universe experience, keep reduced-motion and performance constraints in mind.

## Special note for Next.js

This project has a custom Next.js version and conventions that differ from the generic defaults. Prefer the repo's existing patterns and the local docs before introducing new framework behavior.
