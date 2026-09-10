import { SceneActionSchema, type SceneAction } from "./tutor-contracts";

/**
 * Shared contract for declarative scene commands.
 *
 * The tutor (human UI, or later the backend agent's structured output) may
 * *request* these. The renderer validates and executes them — it never runs
 * arbitrary AI-generated code. Unknown / malformed payloads resolve to null
 * and are ignored, never thrown.
 *
 * Backend agent: if you extend this union, keep it discriminated on `type`
 * and keep every variant safely ignorable by older renderers.
 */
export { SceneActionSchema } from "./tutor-contracts";
export type { SceneAction } from "./tutor-contracts";

/** Parse one unknown (possibly tutor-generated) action. Never throws. */
export function parseSceneAction(input: unknown): SceneAction | null {
  const result = SceneActionSchema.safeParse(input);
  return result.success ? result.data : null;
}

/**
 * Accept a single action, `{ actions: [...] }`, or a bare array.
 * Invalid entries are dropped; an empty result means "do nothing".
 */
export function coerceSceneActions(input: unknown): SceneAction[] {
  if (Array.isArray(input))
    return input.flatMap((a) => {
      const parsed = parseSceneAction(a);
      return parsed ? [parsed] : [];
    });
  if (typeof input === "object" && input !== null && "actions" in input) {
    return coerceSceneActions((input as { actions: unknown }).actions);
  }
  const single = parseSceneAction(input);
  return single ? [single] : [];
}

/**
 * Scenes whose 3D models tag meshes with `hotspot:<id>` groups, enabling
 * model-level isolate/fade. Every other scene degrades gracefully to
 * marker/label emphasis only — never a crash.
 */
export const MODEL_EMPHASIS_SCENES: ReadonlySet<string> = new Set(["cardiac"]);
