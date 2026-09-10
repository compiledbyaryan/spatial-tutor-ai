# SPATIA — Agent Guide

SPATIA is a TanStack Start, React 19, TypeScript, Tailwind, React Three Fiber, Zod, and AI SDK application. Preserve the existing 3D scenes and routes; prefer small, reliable changes suitable for a hackathon.

## Commands

- Install: `npm install`
- Develop: `npm run dev`
- Verify: `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`

## Contracts and safety

- `src/lib/tutor-contracts.ts` is the shared frontend/backend contract.
- Treat user and model data as untrusted. Keep all limits and Zod validation.
- Scene actions are declarative only. Never evaluate generated code.
- Validate hotspot IDs against `src/lib/scenes.ts` and animation IDs against scene capabilities.
- Challenge scoring and mastery updates are deterministic.
- AI secrets are server-only (`AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`).
- `DEMO_MODE=true` must remain fully functional without network access.

## Scene and route invariants

- Never rename existing scene or hotspot IDs without a migration.
- Keep `tanstackStart()` before `viteReact()` in `vite.config.ts`.
- Keep the custom server entry and CSRF middleware.
- Do not hand-edit `src/routeTree.gen.ts`; dev/build regenerates it.
- Preserve third-party asset attribution and licenses.

