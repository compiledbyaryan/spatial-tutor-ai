import { describe, expect, it } from "vitest";

import { evaluateChallenge, getChallenge, getChallenges, scoreChallengeSelection } from "../challenge-engine";
import { getScene } from "../scenes";

describe("challenge engine", () => {
  const trace = getChallenge("heart-trace-oxygenated")!;

  it("scores trace order exactly", () => {
    expect(scoreChallengeSelection(trace, ["left-atrium", "mitral-valve", "left-ventricle", "aortic-valve", "aorta"])).toBe(true);
    expect(scoreChallengeSelection(trace, ["left-atrium", "left-ventricle", "mitral-valve", "aorta"])).toBe(false);
  });

  it("uses only selectable hotspot IDs", () => {
    const heartIds = new Set(getScene("cardiac")!.hotspots.map((hotspot) => hotspot.id));
    for (const challenge of getChallenges("cardiac")) {
      for (const id of challenge.expectedSequence ?? challenge.targetHotspotIds ?? []) {
        expect(heartIds.has(id), `${challenge.id} references ${id}`).toBe(true);
      }
    }
  });

  it("scores compare selections without depending on order", () => {
    const compare = getChallenge("heart-compare-ventricles")!;
    expect(scoreChallengeSelection(compare, ["right-ventricle", "left-ventricle"])).toBe(true);
  });

  it("escalates deterministic hints", () => {
    const result = evaluateChallenge({ challenge: trace, selectedHotspotIds: ["aorta"], responseTimeMs: 1000, attempts: 3, hintCount: 2 });
    expect(result.correct).toBe(false);
    expect(result.hint).toContain("Left atrium");
  });
});
