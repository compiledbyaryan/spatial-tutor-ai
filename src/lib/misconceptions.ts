import type { ChallengeAttempt, MasteryProfile } from "./tutor-contracts";

export type LearningSignal = { id: string; message: string; evidence: string[] };

export function inferLearningSignals(profile: MasteryProfile, attempts: ChallengeAttempt[]): LearningSignal[] {
  const signals: LearningSignal[] = [];
  const identification = profile.categories.identification;
  const flow = profile.categories.flowReasoning;
  const failedFlow = attempts.filter((attempt) => !attempt.correct && attempt.conceptIds.includes("flow-ordering"));

  if (identification.attempts > 0 && identification.score >= 0.65 && failedFlow.length > 0 && flow.score < 0.55) {
    signals.push({
      id: "structures-known-sequence-weak",
      message: "You recognize the structures individually, but the sequence connecting them needs more practice.",
      evidence: failedFlow.slice(-3).map((attempt) => attempt.challengeId),
    });
  }

  const hinted = attempts.filter((attempt) => attempt.hintCount >= 2);
  if (hinted.length >= 2) {
    signals.push({
      id: "high-scaffolding-needed",
      message: "Recent answers improved with step-by-step hints, so the next challenge should keep that scaffolding available.",
      evidence: hinted.slice(-3).map((attempt) => attempt.challengeId),
    });
  }
  return signals;
}

