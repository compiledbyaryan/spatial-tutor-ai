/**
 * Local, offline-first spatial challenge content.
 *
 * Every challenge is answered by clicking structures in the 3D scene —
 * never multiple choice. Content is grounded in `src/lib/scenes.ts`
 * datasets; hotspot IDs here must match that file exactly.
 */

export type SkillAxis = "identification" | "function" | "spatial" | "flow";

export type ChallengeFamily = "identify" | "trace" | "compare" | "relationship" | "predict";

export type ChallengeStep = {
  /** What the learner must do, phrased as a spatial instruction. */
  prompt: string;
  /** Hotspot IDs accepted as correct (usually one). */
  targets: string[];
  /** Candidate set revealed by the first hint (must include the targets). */
  narrow?: string[];
  axis: SkillAxis;
  /** Shown on success. */
  success: string;
  /** Shown after repeated misses instead of the answer alone. */
  reveal: string;
};

export type Challenge = {
  id: string;
  sceneId: string;
  title: string;
  family: ChallengeFamily;
  intro: string;
  steps: ChallengeStep[];
};

export const AXIS_LABEL: Record<SkillAxis, string> = {
  identification: "Structure identification",
  function: "Functional understanding",
  spatial: "Spatial relationships",
  flow: "Flow reasoning",
};

export const FAMILY_LABEL: Record<ChallengeFamily, string> = {
  identify: "Identify",
  trace: "Trace",
  compare: "Compare",
  relationship: "Relationship",
  predict: "Predict",
};

export const challenges: Challenge[] = [
  {
    id: "cardiac-identify",
    sceneId: "cardiac",
    title: "Name that structure",
    family: "identify",
    intro:
      "Two structures, picked for how often students confuse them. Click each one in the 3D view.",
    steps: [
      {
        prompt: "Select the mitral valve.",
        targets: ["mitral-valve"],
        narrow: ["mitral-valve", "aorta", "coronary"],
        axis: "identification",
        success: "Mitral valve confirmed — bicuspid, between left atrium and left ventricle.",
        reveal:
          "That was the mitral valve: the bicuspid gate between the left atrium above and the left ventricle below. Its closure makes the first heart sound.",
      },
      {
        prompt: "Select the aortic arch.",
        targets: ["aorta"],
        narrow: ["aorta", "pulmonary-artery", "coronary"],
        axis: "identification",
        success: "Aortic arch confirmed — the body's largest artery, leaving the top of the model.",
        reveal:
          "That was the aortic arch: the great elastic artery carrying oxygenated blood to the body. Its recoil between beats is the Windkessel effect.",
      },
    ],
  },
  {
    id: "cardiac-trace",
    sceneId: "cardiac",
    title: "Trace oxygenated blood",
    family: "trace",
    intro:
      "Follow oxygenated blood from the lungs into systemic circulation. Four stops, in order.",
    steps: [
      {
        prompt: "Step 1 of 4 — blood arrives from the lungs. Select where it enters.",
        targets: ["left-atrium"],
        narrow: ["left-atrium", "right-atrium"],
        axis: "flow",
        success: "Left atrium — the most posterior chamber, fed by four pulmonary veins.",
        reveal:
          "Oxygenated blood from the lungs enters through the left atrium, the most posterior chamber.",
      },
      {
        prompt: "Step 2 of 4 — blood crosses into the ventricle. Select the gate it passes.",
        targets: ["mitral-valve"],
        narrow: ["mitral-valve", "left-atrium", "left-ventricle"],
        axis: "flow",
        success: "Mitral valve — the bicuspid atrioventricular gate.",
        reveal:
          "Blood crosses the mitral valve, tethered by chordae tendineae so it cannot prolapse under pressure.",
      },
      {
        prompt:
          "Step 3 of 4 — the systemic pump. Select the chamber that drives blood to the body.",
        targets: ["left-ventricle"],
        narrow: ["left-ventricle", "right-ventricle"],
        axis: "flow",
        success: "Left ventricle — wall three times thicker than the right, peaking near 120 mmHg.",
        reveal:
          "The left ventricle is the high-pressure systemic pump. Its thick wall is the whole reason this trace matters.",
      },
      {
        prompt: "Step 4 of 4 — out to the body. Select the great vessel it ejects into.",
        targets: ["aorta"],
        narrow: ["aorta", "pulmonary-artery", "coronary"],
        axis: "flow",
        success:
          "Aorta — stroke volume ejected, elastic recoil carries perfusion through diastole.",
        reveal:
          "The aorta receives the stroke volume. Its elastic lamellae store systolic energy — the Windkessel effect.",
      },
    ],
  },
  {
    id: "cardiac-compare",
    sceneId: "cardiac",
    title: "Thicker wall?",
    family: "compare",
    intro: "One click. Reason from pressure, not size.",
    steps: [
      {
        prompt: "Which ventricle has the thicker wall? Select it.",
        targets: ["left-ventricle"],
        narrow: ["left-ventricle", "right-ventricle"],
        axis: "function",
        success: "Left ventricle — 10–12 mm against systemic pressure versus 3–5 mm on the right.",
        reveal:
          "The left ventricle: it drives the whole systemic circuit at ~120 mmHg, while the right only serves the low-resistance lungs at ~25 mmHg. Wall follows workload.",
      },
    ],
  },
  {
    id: "cardiac-relationship",
    sceneId: "cardiac",
    title: "Between atrium and ventricle",
    family: "relationship",
    intro: "Spatial adjacency with a functional consequence.",
    steps: [
      {
        prompt: "Which structure lies between the left atrium and the left ventricle? Select it.",
        targets: ["mitral-valve"],
        narrow: ["mitral-valve", "left-atrium", "left-ventricle"],
        axis: "spatial",
        success: "Mitral valve — the atrioventricular boundary on the left side.",
        reveal:
          "The mitral valve sits exactly at the left atrioventricular junction. Its papillary muscles and chordae prevent backflow when the ventricle contracts.",
      },
    ],
  },
  {
    id: "cardiac-predict",
    sceneId: "cardiac",
    title: "Valve failure",
    family: "predict",
    intro: "Reason from structure to consequence.",
    steps: [
      {
        prompt:
          "The mitral valve fails to close during systole. Where does blood leak back to? Select it.",
        targets: ["left-atrium"],
        narrow: ["left-atrium", "left-ventricle", "aorta"],
        axis: "function",
        success: "Left atrium — regurgitation flows backward up the pressure gradient.",
        reveal:
          "Blood regurgitates into the left atrium: with the ventricle at 120 mmHg and the atrium near 8, an open gate leaks backward. That murmur is mitral regurgitation.",
      },
    ],
  },
  {
    id: "caffeine-identify",
    sceneId: "caffeine",
    title: "Find the xanthine core",
    family: "identify",
    intro: "One click in the molecular view.",
    steps: [
      {
        prompt: "Select the fused purine core of the molecule.",
        targets: ["purine-core"],
        narrow: ["purine-core", "carbonyls", "planarity"],
        axis: "identification",
        success: "Purine core confirmed — the planar bicyclic xanthine scaffold.",
        reveal:
          "The fused purine core is the planar, conjugated bicycle at the center. Its planarity lets caffeine stack into adenosine receptor pockets.",
      },
    ],
  },
  {
    id: "cathedral-identify",
    sceneId: "cathedral",
    title: "Find the flying buttress",
    family: "identify",
    intro: "One click in the structural bay.",
    steps: [
      {
        prompt: "Select the flying buttress.",
        targets: ["flying-buttress"],
        narrow: ["flying-buttress", "compound-pier", "rib-vault"],
        axis: "identification",
        success:
          "Flying buttress confirmed — the external half-arch walking thrust to the outer pier.",
        reveal:
          "The flying buttress is the external half-arch. It catches lateral vault thrust so the nave wall can dissolve into glass.",
      },
    ],
  },
];

export function challengesForScene(sceneId: string): Challenge[] {
  return challenges.filter((c) => c.sceneId === sceneId);
}

/** Build an adapted review challenge from every step of one axis in a scene. */
export function buildAdaptedChallenge(sceneId: string, axis: SkillAxis): Challenge | null {
  const steps = challenges
    .filter((c) => c.sceneId === sceneId)
    .flatMap((c) =>
      c.steps.map((s, i) => ({ ...s, prompt: `${c.title} — ${s.prompt}`, _order: i })),
    )
    .filter((s) => s.axis === axis);
  if (steps.length === 0) return null;
  return {
    id: `adapted-${sceneId}-${axis}`,
    sceneId,
    title: `Review: ${AXIS_LABEL[axis]}`,
    family: "identify",
    intro: `Adapted review — ${steps.length} step${steps.length > 1 ? "s" : ""} targeting your weakest area.`,
    steps,
  };
}
