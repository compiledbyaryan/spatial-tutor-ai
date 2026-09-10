import { heartChallenges } from "./challenge-bank";
import type { Challenge, ChallengeAttempt, MasteryProfile, MasteryScore } from "./tutor-contracts";

export type MasteryCategory = keyof MasteryProfile["categories"];
const MASTERY_CATEGORIES: MasteryCategory[] = ["identification", "function", "spatialRelation", "flowReasoning"];

const DEFAULT_SCORE: MasteryScore = { score: 0.5, confidence: 0, attempts: 0 };

const categoryByChallengeType: Record<Challenge["type"], MasteryCategory> = {
  identify: "identification",
  compare: "spatialRelation",
  spatial_relation: "spatialRelation",
  trace: "flowReasoning",
  function_reasoning: "function",
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function createMasteryProfile(now = new Date().toISOString()): MasteryProfile {
  return {
    version: 1,
    concepts: {},
    categories: {
      identification: { ...DEFAULT_SCORE },
      function: { ...DEFAULT_SCORE },
      spatialRelation: { ...DEFAULT_SCORE },
      flowReasoning: { ...DEFAULT_SCORE },
    },
    completedChallengeIds: [],
    updatedAt: now,
  };
}

function performance(attempt: ChallengeAttempt, difficulty: Challenge["difficulty"]): number {
  const correctness = attempt.correct ? 1 : 0;
  const hintPenalty = Math.min(0.3, attempt.hintCount * 0.1);
  const retryPenalty = Math.min(0.3, Math.max(0, attempt.attempts - 1) * 0.1);
  const latencyPenalty = attempt.responseTimeMs > 90_000 ? 0.1 : attempt.responseTimeMs > 45_000 ? 0.05 : 0;
  const difficultyCredit = attempt.correct ? (difficulty - 1) * 0.05 : 0;
  return clamp(correctness - hintPenalty - retryPenalty - latencyPenalty + difficultyCredit);
}

function updateScore(previous: MasteryScore, result: number): MasteryScore {
  const weight = previous.attempts === 0 ? 0.35 : 0.25;
  return {
    score: clamp(previous.score * (1 - weight) + result * weight),
    confidence: clamp(previous.confidence + 0.14),
    attempts: previous.attempts + 1,
  };
}

export function updateMastery(profile: MasteryProfile, attempt: ChallengeAttempt, challenge: Challenge): MasteryProfile {
  const result = performance(attempt, challenge.difficulty);
  const category = categoryByChallengeType[challenge.type];
  const concepts = { ...profile.concepts };
  for (const concept of challenge.concepts) concepts[concept] = updateScore(concepts[concept] ?? DEFAULT_SCORE, result);

  return {
    ...profile,
    concepts,
    categories: { ...profile.categories, [category]: updateScore(profile.categories[category], result) },
    completedChallengeIds: attempt.correct
      ? Array.from(new Set([...profile.completedChallengeIds, challenge.id])).slice(-200)
      : profile.completedChallengeIds,
    updatedAt: attempt.timestamp,
  };
}

export function getWeakConcepts(profile: MasteryProfile, limit = 3): Array<{ conceptId: string; score: number; confidence: number }> {
  return Object.entries(profile.concepts)
    .map(([conceptId, value]) => ({ conceptId, ...value }))
    .filter((value) => value.attempts > 0)
    .sort((a, b) => a.score - b.score || b.confidence - a.confidence || a.conceptId.localeCompare(b.conceptId))
    .slice(0, Math.max(0, limit));
}

export function getWeakestMasteryCategory(profile: MasteryProfile): MasteryCategory {
  return [...MASTERY_CATEGORIES].sort((a, b) =>
    profile.categories[a].score - profile.categories[b].score ||
    profile.categories[a].confidence - profile.categories[b].confidence ||
    MASTERY_CATEGORIES.indexOf(a) - MASTERY_CATEGORIES.indexOf(b),
  )[0]!;
}

export function recommendNextChallenge(profile: MasteryProfile, sceneId = "cardiac"): Challenge | undefined {
  const weak = getWeakConcepts(profile, 5).map((item) => item.conceptId);
  const weakestCategory = getWeakestMasteryCategory(profile);
  const candidates = heartChallenges.filter((challenge) => challenge.sceneId === sceneId);
  const unfinished = candidates.filter((challenge) => !profile.completedChallengeIds.includes(challenge.id));
  const pool = unfinished.length > 0 ? unfinished : candidates;
  const recentSuccesses = profile.completedChallengeIds.slice(-2).length;
  const preferredDifficulty = recentSuccesses >= 2 ? 2 : 1;

  return [...pool].sort((a, b) => {
    const aCategory = categoryByChallengeType[a.type] === weakestCategory ? 1 : 0;
    const bCategory = categoryByChallengeType[b.type] === weakestCategory ? 1 : 0;
    const aWeak = a.concepts.filter((concept) => weak.includes(concept)).length;
    const bWeak = b.concepts.filter((concept) => weak.includes(concept)).length;
    return bCategory - aCategory || bWeak - aWeak || Math.abs(a.difficulty - preferredDifficulty) - Math.abs(b.difficulty - preferredDifficulty) || a.id.localeCompare(b.id);
  })[0];
}
