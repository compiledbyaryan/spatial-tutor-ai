import { getChallenge } from "./challenge-engine";
import type { SceneModule } from "./scenes";
import { TutorResponseSchema, type TutorResponse } from "./tutor-contracts";

export function createDemoTutorResponse(input: { scene: SceneModule; hotspotId?: string; question?: string; fallback?: boolean }): TutorResponse {
  const question = input.question?.trim().toLowerCase() ?? "";
  const selected = input.hotspotId ? input.scene.hotspots.find((hotspot) => hotspot.id === input.hotspotId) : undefined;
  const asksThickness = question.includes("left ventricle") && question.includes("thick");
  const asksChallenge = question.includes("quiz") || question.includes("challenge") || question.includes("trace");

  if (input.scene.id === "cardiac" && asksThickness) {
    return TutorResponseSchema.parse({
      answer: "The left ventricle has a much thicker muscular wall because it must generate enough pressure to drive blood through the high-resistance systemic circulation (from the aorta to the entire body). The right ventricle only pumps to the nearby, low-resistance lungs, so it works at far lower pressure. Both eject a similar volume per beat; the difference is the pressure each circuit demands.",
      focus: "left-ventricle",
      actions: [
        { type: "highlight", hotspotIds: ["left-ventricle", "right-ventricle"] },
        { type: "focus", hotspotId: "left-ventricle" },
      ],
      followUp: "Which ventricle would you expect to generate the higher pressure, and why?",
      mode: input.fallback ? "fallback" : "demo",
    });
  }

  if (input.scene.id === "cardiac" && asksChallenge) {
    return TutorResponseSchema.parse({
      answer: "Let’s test the pathway using the structures in this model. Select each structure in the order oxygenated blood follows through the left side of the heart.",
      actions: [{ type: "resetScene" }, { type: "showLabels" }],
      challenge: getChallenge("heart-trace-oxygenated"),
      followUp: "Start with the chamber that receives blood returning from the lungs.",
      mode: input.fallback ? "fallback" : "demo",
    });
  }

  const subject = selected ?? input.scene.hotspots[0];
  return TutorResponseSchema.parse({
    answer: subject
      ? `${subject.name}: ${subject.summary} From your current view, compare it with the nearby labelled structures and follow the visible connections to relate its position to its function.`
      : `${input.scene.title} is ready to explore. Select a labelled structure and I’ll connect what you see to its role in the whole system.`,
    ...(subject ? { focus: subject.id, actions: [{ type: "focus", hotspotId: subject.id }] } : { actions: [] }),
    followUp: asksChallenge ? undefined : "Would you like a short challenge on this structure?",
    mode: input.fallback ? "fallback" : "demo",
  });
}

