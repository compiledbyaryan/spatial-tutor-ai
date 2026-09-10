import { useCallback, useMemo, useRef, useState } from "react";

import { coerceSceneActions, type SceneAction } from "@/lib/scene-actions";
import type { SceneModule } from "@/lib/scenes";

/** Per-hotspot render emphasis derived from dispatched actions. */
export type Emphasis = "normal" | "highlight" | "dimmed" | "hidden";

export type FocusRequest = { hotspotId: string; position: [number, number, number]; nonce: number };

export type ControllerState = {
  /** Latest focus request; SceneCanvas animates the camera toward it. */
  focus: FocusRequest | null;
  emphasis: Record<string, Emphasis>;
  /** Label visibility: all on, off, or restricted to a subset. */
  labels: { mode: "all" } | { mode: "none" } | { mode: "only"; ids: string[] };
  /** Animation toggle overrides keyed by scene option key (e.g. "pulse"). */
  animations: Record<string, boolean>;
  /** Human-readable narration of the last action ("SPATIA focused Left Ventricle"). */
  narration: string | null;
};

/** Maps friendly animation names to per-scene render-option keys. */
const ANIMATION_ALIASES: Record<string, string> = {
  pulse: "pulse",
  heartbeat: "pulse",
  "cardiac-cycle": "pulse",
  hydrogens: "hydrogens",
  vault: "vault",
  unwind: "unwind",
  tighten: "unwind",
  twoSources: "twoSources",
  "second-source": "twoSources",
  bonds: "bonds",
};

const initialState = (scene: SceneModule): ControllerState => ({
  focus: null,
  emphasis: Object.fromEntries(scene.hotspots.map((h) => [h.id, "normal" as Emphasis])),
  labels: { mode: "all" },
  animations: {},
  narration: null,
});

export function useSceneController(scene: SceneModule) {
  const [state, setState] = useState<ControllerState>(() => initialState(scene));
  const nonce = useRef(0);

  const nameOf = useCallback(
    (id: string) => scene.hotspots.find((h) => h.id === id)?.name ?? id,
    [scene],
  );

  const dispatch = useCallback(
    (input: SceneAction | SceneAction[] | unknown) => {
      const actions = Array.isArray(input) ? coerceSceneActions(input) : coerceSceneActions(input);
      if (actions.length === 0) return;
      setState((prev) => {
        let next = { ...prev, emphasis: { ...prev.emphasis }, animations: { ...prev.animations } };
        for (const action of actions) next = applyAction(scene, next, action, nameOf, nonce);
        return next;
      });
    },
    [scene, nameOf],
  );

  const reset = useCallback(() => setState(initialState(scene)), [scene]);

  const options = useMemo(
    () => ({ ...Object.fromEntries([] as [string, boolean][]), ...state.animations }),
    [state.animations],
  );

  return { state, dispatch, reset, options };
}

function applyAction(
  scene: SceneModule,
  prev: ControllerState,
  action: SceneAction,
  nameOf: (id: string) => string,
  nonce: React.MutableRefObject<number>,
): ControllerState {
  const valid = (ids: string[]) => ids.filter((id) => scene.hotspots.some((h) => h.id === id));
  const next: ControllerState = { ...prev, emphasis: { ...prev.emphasis } };

  switch (action.type) {
    case "resetScene":
      return { ...initialState(scene), narration: "Scene reset" };
    case "focus": {
      const hotspot = scene.hotspots.find((h) => h.id === action.hotspotId);
      if (!hotspot) return prev; // invalid hotspot → ignore safely
      nonce.current += 1;
      next.focus = { hotspotId: hotspot.id, position: hotspot.position, nonce: nonce.current };
      next.emphasis[hotspot.id] = "highlight";
      next.narration = `SPATIA focused ${hotspot.name}`;
      return next;
    }
    case "highlight": {
      const ids = valid(action.hotspotIds);
      if (ids.length === 0) return prev;
      for (const id of ids) {
        if (next.emphasis[id] !== "hidden") next.emphasis[id] = "highlight";
      }
      next.narration =
        ids.length === 1
          ? `SPATIA highlighted ${nameOf(ids[0]!)}`
          : `SPATIA highlighted ${ids.length} structures`;
      return next;
    }
    case "isolate": {
      const ids = valid(action.hotspotIds);
      if (ids.length === 0) return prev;
      const keep = new Set(ids);
      for (const h of scene.hotspots) next.emphasis[h.id] = keep.has(h.id) ? "highlight" : "hidden";
      next.narration = `SPATIA isolated ${ids.map(nameOf).join(", ")}`;
      return next;
    }
    case "fadeOthers": {
      const ids = valid(action.hotspotIds);
      if (ids.length === 0) return prev;
      const keep = new Set(ids);
      for (const h of scene.hotspots) {
        if (keep.has(h.id)) {
          if (next.emphasis[h.id] !== "hidden") next.emphasis[h.id] = "highlight";
        } else if (next.emphasis[h.id] !== "hidden") {
          next.emphasis[h.id] = "dimmed";
        }
      }
      next.narration = `SPATIA faded everything except ${ids.map(nameOf).join(", ")}`;
      return next;
    }
    case "setAnimation": {
      const key = ANIMATION_ALIASES[action.animation] ?? action.animation;
      next.animations = { ...prev.animations, [key]: action.enabled };
      next.narration = action.enabled
        ? `SPATIA started ${action.animation}`
        : `SPATIA paused ${action.animation}`;
      return next;
    }
    case "showLabels":
      next.labels = action.hotspotIds
        ? { mode: "only", ids: valid(action.hotspotIds) }
        : { mode: "all" };
      return { ...next, narration: null };
    case "hideLabels":
      next.labels = { mode: "none" };
      return { ...next, narration: null };
  }
}
