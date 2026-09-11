# SPATIA — Agent Guide

SPATIA is a TanStack Start, React 19, TypeScript, Tailwind, React Three Fiber, Zod, and AI SDK application. Preserve the polished 3D experience and the integrated Explore → Ask → Challenge → Master loop.

## Active theme override (2026-09-11, user-directed)

The ui-ux-pro-max skill's SPATIA design system takes precedence over the
previous dark instrument-panel world: light indigo background (`#EEF2FF`),
learning-indigo primary (`#4F46E5` / `#818CF8`), progress-green CTA
(`#22C55E`, `--accent #15803d` for light-mode contrast), Baloo 2 display /
Comic Neue body, micro-interactions at 50–100ms, plain kid-friendly copy
("Level" not "Difficulty", no telemetry jargon). This was an explicit user
instruction to follow the skill over AGENTS.md. Reverting to the dark theme
requires a new explicit user decision — do not "restore" it unasked.

## Commands

- Install: `npm install`
- Develop: `npm run dev`
- Verify: `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`

## Contracts and safety

- `src/lib/tutor-contracts.ts` is the canonical public frontend/backend contract.
- `src/lib/scene-actions.ts`, `src/lib/challenges.ts`, and `src/lib/mastery.ts` are UI adapters, not competing domain models.
- Treat user and model data as untrusted. Keep bounded Zod validation.
- Scene actions are declarative only; execute them through `useSceneController` and never evaluate generated code.
- Validate hotspot IDs against `src/lib/scenes.ts` and animation IDs against scene capabilities.
- Challenge scoring and mastery updates are deterministic backend-domain functions.
- AI secrets are server-only (`AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`).
- `DEMO_MODE=true` must remain fully functional without network access.

## Scene and route invariants

- Never rename existing scene or hotspot IDs without a migration; challenge content keys off them.
- A model mesh or group may use `hotspot:<id>` so `EmphasisRig` can isolate or fade it.
- Preserve `FocusRig`, `EmphasisRig`, `OrbitControls`, the canvas remount reset, model/marker emphasis, labels, animation overrides, and reduced-motion behavior.
- Keep `tanstackStart()` before `viteReact()` in `vite.config.ts`.
- Keep the custom server entry and CSRF middleware.
- Do not hand-edit `src/routeTree.gen.ts`; dev/build regenerates it.
- Preserve third-party asset attribution and licenses.

## Product and UI invariants

- The Human Heart module at `/explore/cardiac` is the flagship demo.
- Tutor replies may return validated actions and a canonical challenge; both must flow directly into the controller and challenge UI.
- The heart trace is anatomically ordered: left atrium → mitral valve → left ventricle → aortic valve → aorta.
- Keep the 3D studio responsive and accessible. Maintain the existing Tailwind tokens, loading/error recovery, weak-GPU render budget, and mobile drawer.
- Mastery must derive from `mastery-engine.ts`, persist through `learning-store.ts`, and recommend the next weak-area challenge deterministically.
