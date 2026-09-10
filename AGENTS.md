# SPATIA — Agent Guide

Spatially aware AI tutor: learner explores procedural 3D scenes (React Three Fiber),
clicks structures, and a viewpoint-aware server-side tutor explains them.
Core loop: **Explore → Ask** (Challenge/Mastery do not exist yet — do not reference them as if they do).

## Stack (verified, do not rewrite)

React 19 + TypeScript + Vite through `@lovable.dev/vite-tanstack-config` +
TanStack Start / Router (file-based) / Query + Three.js + R3F + Drei +
Tailwind v4 + shadcn (`new-york`) + Zod + Vercel AI SDK (`ai` + `@ai-sdk/openai-compatible`
pointing at the Lovable gateway in `src/lib/ai-gateway.server.ts`).
Lovable deps (`vite-tanstack-config`, `cloud-auth-js`, gateway, Supabase shim) are load-bearing —
do not remove/rename one without migrating tutor + auth + vite config together.

## Commands

- Install: `bun install` (`bun.lock` is source of truth; `bunfig.toml` has a 24h
  `minimumReleaseAge` guard — confirm with user before adding `minimumReleaseAgeExcludes`).
- `npm run dev` (= `vite dev`), `npm run build` (= `vite build`), `npm run preview`, `npm run lint` (= `eslint .`), `npm run format`.
- No test or typecheck script: typecheck with `npx tsc --noEmit`. No tests, no CI workflows.
- Verify before significant commits: `lint` → `tsc --noEmit` → `build`.

## Vite / Start wiring (non-obvious)

- `vite.config.ts` header lists plugins the wrapper already provides
  (TanStack Start/devtools, React, Tailwind, tsConfigPaths, nitro, `VITE_*` injection,
  `@` alias, dedupe). Never add them manually or the app breaks with duplicate plugins.
- TanStack Start server entry is redirected to `src/server.ts` (SSR error wrapper) —
  keep `tanstackStart.server.entry` pointing at it.
- `src/start.ts` must keep `attachSupabaseAuth` in `functionMiddleware` or the browser
  never attaches the bearer token to serverFn RPCs. CSRF middleware for serverFns is also required there.

## Routes

- File-based in `src/routes`: `/` (`index.tsx`), `/about`, `/explore/$sceneId`
  (`ssr: false`, loader resolves `getScene` or `notFound`). Dynamic segments use bare `$`
  (`explore.$sceneId.tsx`), never curly braces. Root shell is `__root.tsx` — preserve `<Outlet />`.
- `src/routeTree.gen.ts` and everything under `src/integrations/` marked auto-generated:
  never hand-edit; they regenerate on dev/build.
- Known gap (verified 2026-09-10): a pathless `_authenticated/route.tsx` layout
  breaks the route generator with `Conflicting configuration paths ... "/"` — it is
  parked at `/tmp/opencode/route-backup/` (outside the repo), so do not recreate that
  pathless-layout shape. `SiteNav` links (`/graphs`, `/focus`, `/flashcards`, `/dashboard`)
  and the `auth.tsx` redirect to `/dashboard` have **no routes** (dead links). Regenerating
  the route tree added `/auth` to `routeTree.gen.ts`; verify any new route appears there.

## Grounding data — the one contract that matters

- `src/lib/scenes.ts` (`SceneModule`, `Hotspot`, `scenes[]`, `getScene`) is the single
  source of truth for all scene content, hotspot IDs, positions, and `tutorContext`.
- **Never rename a hotspot `id` or scene `id`**: `StudioView` (`SCENE_TOGGLES`),
  `SceneCanvas` (`SceneBody` dispatch), and tutor prompts all key off them.
- Adding a scene = new entry in `scenes[]` + a branch in `SceneBody`
  (`src/components/scene/SceneCanvas.tsx:47`) + optional `SCENE_TOGGLES` entry
  (`src/components/StudioView.tsx:9`). All current models are procedural (no GLB assets);
  if you add an external asset, create `THIRD_PARTY_ASSETS.md` with name/creator/source/
  URL/license/attribution/path/modifications and never strip attribution.

## Tutor pipeline

- `askTutor` (`src/lib/tutor.functions.ts`) is a Zod-validated `createServerFn` (`POST`);
  call it from the client only via `useServerFn` (see `TutorPanel.tsx`). Key lives in
  `process.env["LOVABLE_API_KEY"]` — server-side only, never the browser bundle.
  There is **no deterministic/demo fallback**: without the key the tutor throws.
- `ViewpointTracker` samples the camera every 320 ms and emits only on meaningful change;
  selecting a hotspot auto-briefs. Prompt contract is ~90–150 words plain prose, no markdown
  headings/lists, grounded in the selected hotspot dataset + one neighbouring structure.
  Gateway 429/402/403 errors are mapped to UI messages in the server function — surface them,
  don't swallow.
- Supabase tables (`profiles`, `module_progress`, `flashcards`, `focus_sessions`, RLS own-row)
  exist via migration but **no client code queries them yet** — check before assuming wiring.
  Browser env uses `import.meta.env` `VITE_*`; server uses `process.env` (`client.ts` falls back).

## 3D + style constraints

- Perf budget (keep on weak GPUs): `dpr={[1,2]}`, one shadow-casting directional light
  (2048px map), `Environment` + `Lightformer` IBL (no CDN HDR), capped `min/maxDistance`
  on `OrbitControls`. Reset view remounts canvas via `key` — keep that mechanism working.
- `src/styles.css` is Tailwind v4 with oklch semantic tokens and `@utility` helpers
  (`panel`, `label-mono`, `card-lift`, `text-sheen`, `animate-reveal`, `grid-backdrop`).
  Never hardcode colors in components; use tokens. Fonts: Sora (display) / Manrope (body) /
  JetBrains Mono, loaded in `__root.tsx`. Motion has a `prefers-reduced-motion` guard — preserve it.
- shadcn aliases: `@/components`, `@/lib`, `@/hooks` (`components.json`). Prettier: width 100,
  double quotes, semicolons, trailing commas. ESLint bans the `server-only` package import
  (use `*.server.ts` / Start server-only instead); `no-unused-vars` is off.
- TS is strict with `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`,
  `noPropertyAccessFromIndexSignature` — handle optional/indexed access explicitly.
- AI output is untrusted: Zod-validate it, never execute LLM-generated code, unknown
  hotspot IDs must fail safe (`notFound`, never crash the renderer). Every async flow needs
  loading / error / recovery states — no infinite spinners.

## Craft bar (impeccable)

The 3D studio is the product hero — avoid generic dashboard styling; every visual change
must serve Explore → Ask. For UI work, run the impeccable skill's `context` launcher once
per session (cwd at repo root) before editing, then follow its directives.

## Workflow

Branch off `main` (`agent/*`, `fix/*`); small coherent commits; never force-push shared
branches or commit secrets. Before merge: no secrets, no major console errors, all routes
load, heart (`/explore/cardiac`) flow works, tutor error states render, production build passes.
