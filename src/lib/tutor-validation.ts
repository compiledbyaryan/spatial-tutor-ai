import type { SceneModule } from "./scenes";
import { getChallenge } from "./challenge-engine";
import { TutorResponseSchema, type SceneAction, type TutorResponse } from "./tutor-contracts";

function validateAction(action: SceneAction, allowedIds: Set<string>, animations: Set<string>): SceneAction | undefined {
  if (action.type === "focus") return allowedIds.has(action.hotspotId) ? action : undefined;
  if (action.type === "setAnimation") return animations.has(action.animation) ? action : undefined;
  if (action.type === "highlight" || action.type === "isolate" || action.type === "fadeOthers") {
    const hotspotIds = Array.from(new Set(action.hotspotIds.filter((id) => allowedIds.has(id))));
    return hotspotIds.length > 0 ? { ...action, hotspotIds } : undefined;
  }
  if (action.type === "showLabels" && action.hotspotIds) {
    const hotspotIds = Array.from(new Set(action.hotspotIds.filter((id) => allowedIds.has(id))));
    return hotspotIds.length > 0 ? { ...action, hotspotIds } : undefined;
  }
  return action;
}

export function validateTutorResponse(value: unknown, scene: SceneModule): TutorResponse {
  const parsed = TutorResponseSchema.parse(value);
  const allowedIds = new Set(scene.hotspots.map((hotspot) => hotspot.id));
  const animations = new Set(scene.capabilities?.animations ?? []);
  const actions = parsed.actions
    .map((action) => validateAction(action, allowedIds, animations))
    .filter((action): action is SceneAction => Boolean(action));
  const curatedChallenge = parsed.challenge ? getChallenge(parsed.challenge.id) : undefined;
  const challenge = curatedChallenge?.sceneId === scene.id ? curatedChallenge : undefined;
  if (parsed.focus && !allowedIds.has(parsed.focus)) {
    const { focus: _focus, challenge: _challenge, ...withoutFocus } = parsed;
    return { ...withoutFocus, actions, ...(challenge ? { challenge } : {}) };
  }
  const { challenge: _challenge, ...withoutChallenge } = parsed;
  return { ...withoutChallenge, actions, ...(challenge ? { challenge } : {}) };
}
