import type { SceneModule } from "./scenes";
import { AXIS_LABEL, type SkillAxis } from "./challenges";

/**
 * Frontend-owned learner state. Local-only for now (localStorage);
 * the backend agent may hydrate/replace persistence later — keep these
 * shapes stable and deterministic.
 */

const KEY = "spatia-mastery-v1";

type AxisTally = { asked: number; clean: number };

type SceneMastery = {
  axes: Record<SkillAxis, AxisTally>;
  concepts: Record<string, AxisTally>;
  updatedAt: string;
};

type Store = { version: 1; scenes: Record<string, SceneMastery> };

const AXES: SkillAxis[] = ["identification", "function", "spatial", "flow"];

function emptyScene(): SceneMastery {
  return {
    axes: {
      identification: { asked: 0, clean: 0 },
      function: { asked: 0, clean: 0 },
      spatial: { asked: 0, clean: 0 },
      flow: { asked: 0, clean: 0 },
    },
    concepts: {},
    updatedAt: new Date().toISOString(),
  };
}

function load(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { version: 1, scenes: {} };
    const parsed = JSON.parse(raw) as Store;
    if (parsed.version !== 1 || typeof parsed.scenes !== "object")
      return { version: 1, scenes: {} };
    return parsed;
  } catch {
    return { version: 1, scenes: {} };
  }
}

function save(store: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // Storage full or unavailable (private mode) — mastery simply won't persist.
  }
}

/** Record one answered challenge step. `clean` = correct first try, no hints. */
export function recordStep(sceneId: string, axis: SkillAxis, conceptIds: string[], clean: boolean) {
  const store = load();
  const entry = store.scenes[sceneId] ?? emptyScene();
  const axisTally = entry.axes[axis] ?? { asked: 0, clean: 0 };
  axisTally.asked += 1;
  if (clean) axisTally.clean += 1;
  entry.axes[axis] = axisTally;
  for (const id of conceptIds) {
    const tally = entry.concepts[id] ?? { asked: 0, clean: 0 };
    tally.asked += 1;
    if (clean) tally.clean += 1;
    entry.concepts[id] = tally;
  }
  entry.updatedAt = new Date().toISOString();
  store.scenes[sceneId] = entry;
  save(store);
}

/** Laplace-smoothed 0–100 level so a single attempt never reads as 0 or 100. */
export function levelOf(tally: AxisTally): number {
  return Math.round((100 * (tally.clean + 1)) / (tally.asked + 2));
}

export type MasterySummary = {
  totalAsked: number;
  levels: Record<SkillAxis, number>;
  strongest: SkillAxis;
  weakest: SkillAxis;
  sentence: string;
  concepts: { id: string; name: string; level: number; asked: number }[];
};

/** Deterministic summary, or null when the learner has no attempts in this scene. */
export function summarizeMastery(scene: SceneModule): MasterySummary | null {
  const store = load();
  const entry = store.scenes[scene.id];
  if (!entry) return null;
  const totalAsked = AXES.reduce((n, a) => n + (entry.axes[a]?.asked ?? 0), 0);
  if (totalAsked === 0) return null;

  const levels = Object.fromEntries(
    AXES.map((a) => [a, levelOf(entry.axes[a] ?? { asked: 0, clean: 0 })]),
  ) as Record<SkillAxis, number>;
  const ranked = [...AXES].sort((a, b) => levels[a] - levels[b]);
  const weakest = ranked[0] ?? "identification";
  const strongest = ranked[ranked.length - 1] ?? "identification";

  const nameOf = (id: string) => scene.hotspots.find((h) => h.id === id)?.name ?? id;
  const concepts = Object.entries(entry.concepts)
    .map(([id, tally]) => ({ id, name: nameOf(id), level: levelOf(tally), asked: tally.asked }))
    .sort((a, b) => b.asked - a.asked || a.level - b.level)
    .slice(0, 5);

  const sentence =
    weakest === strongest
      ? `Even across ${AXIS_LABEL[weakest].toLowerCase()} so far — keep challenging to separate signal from noise.`
      : `Your ${AXIS_LABEL[strongest].toLowerCase()} is solid, but ${AXIS_LABEL[weakest].toLowerCase()} needs work.`;

  return { totalAsked, levels, strongest, weakest, sentence, concepts };
}
