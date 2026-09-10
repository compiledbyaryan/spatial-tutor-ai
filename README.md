# SPATIA

SPATIA is a viewpoint-aware 3D tutor that connects explanations, safe declarative scene actions, deterministic challenges, and transparent mastery updates. The flagship Human Heart module works with a live OpenAI-compatible model or entirely offline in deterministic demo mode.

## Quick start

Requirements: Node.js 22+ and npm.

```sh
npm install
cp .env.example .env
npm run dev
```

Open `/explore/cardiac`. The default example configuration enables demo mode, so no API key is required.

## AI configuration

All AI credentials are server-only; never prefix them with `VITE_`.

```dotenv
DEMO_MODE=false
AI_API_KEY=your-key
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4.1-mini
```

`AI_BASE_URL` may point to any compatible endpoint. If configuration is absent, the provider fails, times out, rate-limits, or returns malformed structured output, SPATIA returns a validated deterministic fallback using the same `TutorResponse` contract. Set `DEMO_MODE=true` to guarantee that no inference request is attempted; responses identify themselves with `mode: "demo"`.

## Adaptive learning architecture

- `src/lib/tutor-contracts.ts` is the shared frontend/backend Zod contract.
- `src/lib/tutor.functions.ts` validates bounded input, supplies exact scene grounding, requests structured output, validates every action, and falls back safely.
- `src/lib/challenge-bank.ts` contains 18 curated Human Heart challenges.
- `src/lib/challenge-engine.ts` scores selections and ordered traces deterministically.
- `src/lib/mastery-engine.ts` applies bounded, explainable updates and recommends a weak-area challenge.
- `src/lib/misconceptions.ts` derives cautious learning signals from observed attempts.
- `src/lib/challenge.functions.ts` exposes challenge listing and submission as server functions.
- `src/lib/learning-store.ts` provides validated localStorage persistence helpers for the frontend.

The mastery score is a hackathon heuristic, not a scientifically validated learner model. Correctness is dominant, with small transparent adjustments for hints, retries, latency, and difficulty.

## Frontend integration contract

Import `TutorResponse`, `SceneAction`, `Challenge`, `ChallengeAttempt`, `MasteryProfile`, and `MasterySummary` from `@/lib/tutor-contracts`. New fields are additive; `actions` defaults to `[]` and `mode` defaults to `"live"` during parsing.

The UI should execute only the returned declarative `SceneAction` variants. Challenge correctness must come from `submitChallenge` or `scoreChallengeSelection`, never an LLM. Persist only the bounded learning state; no personal data is required.

## Verification

```sh
npm test
npm run lint
npm run typecheck
npm run build
```

## Demo script

1. Set `DEMO_MODE=true` and open the Human Heart module.
2. Select Left Ventricle.
3. Ask: “Why is the left ventricle thicker than the right?”
4. Ask for a trace challenge and run `heart-trace-oxygenated`.
5. Submit `left-atrium → mitral-valve → left-ventricle → aorta`.
6. Feed the returned mastery profile into the next submission or tutor call and use the returned recommendation to review a weak area.

