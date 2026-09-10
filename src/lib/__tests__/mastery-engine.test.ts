import { describe, expect, it } from "vitest";

import { evaluateChallenge, getChallenge } from "../challenge-engine";
import { createMasteryProfile, getWeakConcepts, recommendNextChallenge, updateMastery } from "../mastery-engine";

describe("mastery engine", () => {
  it("lowers weak concept scores after a failed, hinted attempt", () => {
    const challenge = getChallenge("heart-trace-oxygenated")!;
    const evaluation = evaluateChallenge({ challenge, selectedHotspotIds: ["aorta"], responseTimeMs: 100_000, attempts: 3, hintCount: 2 });
    const updated = updateMastery(createMasteryProfile(), evaluation.attempt, challenge);
    expect(updated.categories.flowReasoning.score).toBeLessThan(0.5);
    expect(getWeakConcepts(updated).map((item) => item.conceptId)).toContain("flow-ordering");
    expect(recommendNextChallenge(updated)?.concepts).toContain("flow-ordering");
  });

  it("records completion after a correct attempt", () => {
    const challenge = getChallenge("heart-identify-lv")!;
    const evaluation = evaluateChallenge({ challenge, selectedHotspotIds: ["left-ventricle"], responseTimeMs: 5000, attempts: 1, hintCount: 0 });
    const updated = updateMastery(createMasteryProfile(), evaluation.attempt, challenge);
    expect(updated.completedChallengeIds).toContain(challenge.id);
    expect(updated.categories.identification.score).toBeGreaterThan(0.5);
  });

  it("recommends an unpracticed weak category after a successful trace", () => {
    const challenge = getChallenge("heart-trace-oxygenated")!;
    const evaluation = evaluateChallenge({ challenge, selectedHotspotIds: challenge.expectedSequence!, responseTimeMs: 5000, attempts: 1, hintCount: 0 });
    const updated = updateMastery(createMasteryProfile(), evaluation.attempt, challenge);
    expect(recommendNextChallenge(updated)?.type).toBe("identify");
  });
});
