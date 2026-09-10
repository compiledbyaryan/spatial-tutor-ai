import { heartChallenges } from "./challenge-bank";
import { ChallengeAttemptSchema, ChallengeSchema, type Challenge, type ChallengeAttempt } from "./tutor-contracts";

export type ChallengeEvaluation = {
  correct: boolean;
  expectedHotspotIds: string[];
  feedback: string;
  hint?: string;
  attempt: ChallengeAttempt;
};

export function getChallenges(sceneId: string): Challenge[] {
  return heartChallenges.filter((challenge) => challenge.sceneId === sceneId).map((challenge) => ChallengeSchema.parse(challenge));
}

export function getChallenge(challengeId: string): Challenge | undefined {
  const challenge = heartChallenges.find((candidate) => candidate.id === challengeId);
  return challenge ? ChallengeSchema.parse(challenge) : undefined;
}

function equalOrdered(actual: string[], expected: string[]) {
  return actual.length === expected.length && actual.every((value, index) => value === expected[index]);
}

function equalSet(actual: string[], expected: string[]) {
  return actual.length === expected.length && new Set(actual).size === actual.length && actual.every((value) => expected.includes(value));
}

export function scoreChallengeSelection(challenge: Challenge, selectedHotspotIds: string[]): boolean {
  const selected = selectedHotspotIds.slice(0, 12);
  if (challenge.expectedSequence) return equalOrdered(selected, challenge.expectedSequence);
  return equalSet(selected, challenge.targetHotspotIds ?? []);
}

export function evaluateChallenge(input: {
  challenge: Challenge;
  selectedHotspotIds: string[];
  responseTimeMs: number;
  attempts: number;
  hintCount: number;
  timestamp?: string;
}): ChallengeEvaluation {
  const challenge = ChallengeSchema.parse(input.challenge);
  const expectedHotspotIds = challenge.expectedSequence ?? challenge.targetHotspotIds ?? [];
  const correct = scoreChallengeSelection(challenge, input.selectedHotspotIds);
  const hintIndex = Math.min(Math.max(input.attempts - 1, 0), challenge.hints.length - 1);
  const hint = correct ? undefined : challenge.hints[hintIndex]?.text;
  const attempt = ChallengeAttemptSchema.parse({
    challengeId: challenge.id,
    sceneId: challenge.sceneId,
    conceptIds: challenge.concepts,
    correct,
    responseTimeMs: input.responseTimeMs,
    attempts: input.attempts,
    hintCount: input.hintCount,
    selectedHotspotIds: input.selectedHotspotIds,
    timestamp: input.timestamp ?? new Date().toISOString(),
  });

  return {
    correct,
    expectedHotspotIds,
    feedback: correct
      ? "Correct — the structures and their order match the blood-flow pathway."
      : challenge.expectedSequence
        ? "Not quite. The structures must be selected in physiological flow order."
        : "Not quite. Reconsider which visible structures satisfy every part of the prompt.",
    ...(hint ? { hint } : {}),
    attempt,
  };
}

