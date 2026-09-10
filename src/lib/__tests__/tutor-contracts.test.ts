import { describe, expect, it } from "vitest";

import { getScene } from "../scenes";
import { TutorResponseSchema } from "../tutor-contracts";
import { validateTutorResponse } from "../tutor-validation";

describe("TutorResponse validation", () => {
  const scene = getScene("cardiac")!;

  it("rejects unknown action types", () => {
    expect(() => TutorResponseSchema.parse({ answer: "Safe answer", actions: [{ type: "executeCode", code: "alert(1)" }] })).toThrow();
  });

  it("filters unknown hotspots and unsupported animations", () => {
    const response = validateTutorResponse(
      {
        answer: "Grounded answer",
        focus: "invented-structure",
        actions: [
          { type: "highlight", hotspotIds: ["left-ventricle", "invented-structure"] },
          { type: "focus", hotspotId: "invented-structure" },
          { type: "setAnimation", animation: "explode", enabled: true },
        ],
      },
      scene,
    );
    expect(response.focus).toBeUndefined();
    expect(response.actions).toEqual([{ type: "highlight", hotspotIds: ["left-ventricle"] }]);
  });

  it("applies backwards-compatible defaults", () => {
    expect(TutorResponseSchema.parse({ answer: "Hello" })).toMatchObject({ actions: [], mode: "live" });
  });
});

