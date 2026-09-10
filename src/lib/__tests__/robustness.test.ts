import { describe, expect, it } from "vitest";

import { getScene } from "../scenes";

describe("scene lookup", () => {
  it("fails closed for unknown scene IDs", () => {
    expect(getScene("not-a-scene")).toBeUndefined();
  });
});

