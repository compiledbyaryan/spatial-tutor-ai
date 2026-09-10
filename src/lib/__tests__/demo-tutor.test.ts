import { describe, expect, it } from "vitest";

import { createDemoTutorResponse } from "../demo-tutor";
import { getScene } from "../scenes";
import { TutorResponseSchema } from "../tutor-contracts";

describe("deterministic tutor", () => {
  const heart = getScene("cardiac")!;

  it("covers the flagship ventricle explanation", () => {
    const response = createDemoTutorResponse({ scene: heart, hotspotId: "left-ventricle", question: "Why is the left ventricle thicker than the right?" });
    expect(TutorResponseSchema.parse(response).mode).toBe("demo");
    expect(response.actions).toContainEqual({ type: "focus", hotspotId: "left-ventricle" });
  });

  it("returns the curated oxygenated blood challenge", () => {
    const response = createDemoTutorResponse({ scene: heart, question: "Give me a trace challenge" });
    expect(response.challenge?.id).toBe("heart-trace-oxygenated");
  });
});

