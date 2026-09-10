import { appendLearnerEvent, type LearnerEvent } from "./learner-events";
import { loadLearningState, saveLearningState, type LearningState } from "./learning-store";
import { getWeakConcepts, getWeakestMasteryCategory, recommendNextChallenge, updateMastery } from "./mastery-engine";
import type { Challenge, ChallengeAttempt, MasteryProfile } from "./tutor-contracts";
import type { SceneModule } from "./scenes";

export type MasteryAxis = keyof MasteryProfile["categories"];

export const AXIS_LABEL: Record<MasteryAxis, string> = {
  identification: "Structure identification",
  function: "Functional understanding",
  spatialRelation: "Spatial relationships",
  flowReasoning: "Flow reasoning",
};

const AXES: MasteryAxis[] = ["identification", "function", "spatialRelation", "flowReasoning"];

function storage(): Storage | undefined {
  return typeof window === "undefined" ? undefined : window.localStorage;
}

export function loadLearning(): LearningState {
  return loadLearningState(storage());
}

export function persistLearning(state: LearningState): LearningState {
  saveLearningState(storage(), state);
  return state;
}

export function addLearningEvent(state: LearningState, event: LearnerEvent): LearningState {
  return persistLearning({ ...state, events: appendLearnerEvent(state.events, event) });
}

export function recordChallengeResult(
  state: LearningState,
  attempt: ChallengeAttempt,
  challenge: Challenge,
): LearningState {
  const mastery = updateMastery(state.mastery, attempt, challenge);
  let events = appendLearnerEvent(state.events, {
    type: "challenge_attempt",
    sceneId: challenge.sceneId,
    timestamp: attempt.timestamp,
    attempt,
  });
  if (attempt.correct) {
    events = appendLearnerEvent(events, {
      type: "challenge_completed",
      sceneId: challenge.sceneId,
      challengeId: challenge.id,
      timestamp: attempt.timestamp,
    });
  }
  return persistLearning({ mastery, attempts: [...state.attempts, attempt].slice(-50), events });
}

export type MasteryViewModel = {
  totalAttempts: number;
  levels: Record<MasteryAxis, number>;
  strongest: MasteryAxis;
  weakest: MasteryAxis;
  sentence: string;
  /** Short evidence line naming what the weakest-axis claim rests on. */
  weakEvidence: string | null;
  concepts: { id: string; name: string; level: number; attempts: number }[];
  recommended: Challenge | undefined;
};

export function summarizeMastery(profile: MasteryProfile, scene: SceneModule): MasteryViewModel | null {
  const totalAttempts = AXES.reduce((sum, axis) => sum + profile.categories[axis].attempts, 0);
  if (totalAttempts === 0) return null;
  const levels = Object.fromEntries(
    AXES.map((axis) => [axis, Math.round(profile.categories[axis].score * 100)]),
  ) as Record<MasteryAxis, number>;
  const ranked = [...AXES].sort((a, b) => levels[a] - levels[b]);
  const weakest = getWeakestMasteryCategory(profile);
  const strongest = ranked.at(-1) ?? "identification";
  const nameOf = (id: string) => scene.hotspots.find((hotspot) => hotspot.id === id)?.name ?? id;
  const concepts = getWeakConcepts(profile, 5).map(({ conceptId, score, confidence: _confidence }) => ({
    id: conceptId,
    name: nameOf(conceptId),
    level: Math.round(score * 100),
    attempts: profile.concepts[conceptId]?.attempts ?? 0,
  }));
  const sentence =
    weakest === strongest
      ? `Keep practicing ${AXIS_LABEL[weakest].toLowerCase()} to build stronger evidence.`
      : `Your ${AXIS_LABEL[strongest].toLowerCase()} is strongest; ${AXIS_LABEL[weakest].toLowerCase()} is the next review target.`;
  // Evidence line: weakest axis score + attempts, plus the lowest concept when present.
  const weakScore = profile.categories[weakest];
  const worstConcept = concepts[0];
  const weakEvidence =
    `${AXIS_LABEL[weakest].toLowerCase()} at ${Math.round(weakScore.score * 100)}% over ${weakScore.attempts} scored attempt${weakScore.attempts === 1 ? "" : "s"}` +
    (worstConcept ? `; lowest concept “${worstConcept.name}” at ${worstConcept.level}%` : "");
  return {
    totalAttempts,
    levels,
    strongest,
    weakest,
    sentence,
    weakEvidence,
    concepts,
    recommended: recommendNextChallenge(profile, scene.id),
  };
}
