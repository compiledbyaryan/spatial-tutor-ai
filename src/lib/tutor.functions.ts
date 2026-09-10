import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

import { createAiModel, getAiRuntimeConfig, isDemoMode } from "./ai-provider.server";
import { heartChallenges } from "./challenge-bank";
import { createDemoTutorResponse } from "./demo-tutor";
import { getScene } from "./scenes";
import {
  ChallengeAttemptSchema,
  ChallengeSchema,
  MasteryProfileSchema,
  TutorResponseSchema,
  type TutorResponse,
} from "./tutor-contracts";
import { validateTutorResponse } from "./tutor-validation";

const ModelTutorResponseSchema = TutorResponseSchema.omit({ mode: true });
const MasterySummarySchema = MasteryProfileSchema.pick({ categories: true, concepts: true, updatedAt: true });

const TutorInput = z
  .object({
    sceneId: z.string().trim().min(1).max(80),
    hotspotId: z.string().trim().min(1).max(80).optional(),
    question: z.string().trim().max(600).optional(),
    viewpoint: z
      .object({
        position: z.tuple([z.number().finite(), z.number().finite(), z.number().finite()]),
        distance: z.number().finite().min(0).max(10_000),
        azimuth: z.number().finite().min(-100).max(100),
        polar: z.number().finite().min(-100).max(100),
      })
      .strict()
      .optional(),
    history: z
      .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(1200) }).strict())
      .max(12)
      .optional(),
    masterySummary: MasterySummarySchema.optional(),
    recentChallengeAttempts: z.array(ChallengeAttemptSchema).max(8).optional(),
    activeChallenge: ChallengeSchema.optional(),
    recentMisconceptions: z.array(z.string().trim().min(1).max(240)).max(6).optional(),
  })
  .strict();

function describeViewpoint(v: NonNullable<z.infer<typeof TutorInput>["viewpoint"]>) {
  const deg = (r: number) => Math.round((r * 180) / Math.PI);
  const az = ((deg(v.azimuth) % 360) + 360) % 360;
  const side = az < 45 || az >= 315 ? "front" : az < 135 ? "right side" : az < 225 ? "rear" : "left side";
  const elevation = deg(v.polar) < 55 ? "above" : deg(v.polar) > 110 ? "below" : "eye level";
  const proximity = v.distance < 4 ? "very close" : v.distance < 9 ? "medium range" : "wide view";
  return `Camera: ${side}, ${elevation}, ${proximity}; distance ${v.distance.toFixed(1)}; position ${v.position.map((n) => n.toFixed(1)).join(", ")}.`;
}

function safeContext(value: unknown, max = 3000) {
  const serialized = JSON.stringify(value ?? null);
  return serialized.length > max ? `${serialized.slice(0, max)}…` : serialized;
}

export const askTutor = createServerFn({ method: "POST" })
  .validator((input: unknown) => TutorInput.parse(input))
  .handler(async ({ data }): Promise<TutorResponse> => {
    const scene = getScene(data.sceneId);
    if (!scene) throw new Error("Unknown learning module.");
    const hotspot = data.hotspotId ? scene.hotspots.find((item) => item.id === data.hotspotId) : undefined;
    if (data.hotspotId && !hotspot) throw new Error("Unknown structure for this learning module.");

    const deterministicResponse = (fallback = false) =>
      createDemoTutorResponse({
        scene,
        ...(data.hotspotId ? { hotspotId: data.hotspotId } : {}),
        ...(data.question ? { question: data.question } : {}),
        ...(fallback ? { fallback: true } : {}),
      });

    if (isDemoMode()) return deterministicResponse();

    const viewpointNote = data.viewpoint ? describeViewpoint(data.viewpoint) : "Viewpoint unavailable.";
    const availableChallenges = heartChallenges
      .filter((challenge) => challenge.sceneId === scene.id)
      .map(({ id, type, prompt, concepts, difficulty }) => ({ id, type, prompt, concepts, difficulty }));
    const system = [
      "You are SPATIA, a spatial tutoring engine inside an interactive 3D scene.",
      scene.tutorContext,
      `Module: ${scene.title} (${scene.subject}).`,
      `Allowed hotspots: ${scene.hotspots.map((item) => `${item.id}: ${item.name} — ${item.summary} Facts: ${item.facts.join("; ")}`).join("\n")}`,
      `Scene relations: ${safeContext(scene.relations ?? [])}`,
      `Capabilities: ${safeContext(scene.capabilities ?? { animations: [], labels: true, isolation: true })}`,
      `Viewpoint: ${viewpointNote}`,
      hotspot ? `Selected structure: ${hotspot.id} (${hotspot.name}).` : "No structure is selected.",
      `Mastery summary: ${safeContext(data.masterySummary)}`,
      `Recent attempts: ${safeContext(data.recentChallengeAttempts)}`,
      `Active challenge: ${safeContext(data.activeChallenge)}`,
      `Recent learning signals: ${safeContext(data.recentMisconceptions)}`,
      `Curated challenges you may select by ID: ${safeContext(availableChallenges)}`,
      "Return only the requested structured object. Use only allowed hotspot IDs and supported animations. If selecting a challenge, use its exact ID. Prefer 80–170 words. Ground claims in supplied facts. Scene actions are suggestions, never code. Do not diagnose the learner psychologically.",
    ].join("\n");
    const prompt = data.question?.trim() || (hotspot ? `Explain ${hotspot.name} in this view and decide what should happen next.` : "Orient me and decide what I should inspect next.");

    try {
      getAiRuntimeConfig();
      const result = await generateText({
        model: createAiModel(),
        system,
        messages: [
          ...(data.history ?? []).slice(-8).map((message) => ({ role: message.role, content: message.content }) as const),
          { role: "user" as const, content: prompt },
        ],
        output: Output.object({ schema: ModelTutorResponseSchema, name: "TutorResponse" }),
        temperature: 0.35,
        abortSignal: AbortSignal.timeout(12_000),
      });
      return validateTutorResponse({ ...result.output, mode: "live" }, scene);
    } catch (error) {
      console.warn("[SPATIA] AI inference unavailable; deterministic fallback used.", error instanceof Error ? error.name : "UnknownError");
      return deterministicResponse(true);
    }
  });
