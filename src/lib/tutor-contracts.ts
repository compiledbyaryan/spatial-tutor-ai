import { z } from "zod";

const boundedId = z.string().trim().min(1).max(80).regex(/^[a-z0-9][a-z0-9-]*$/);
const boundedText = (max: number) => z.string().trim().min(1).max(max);

export const SceneActionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("focus"), hotspotId: boundedId }).strict(),
  z.object({ type: z.literal("highlight"), hotspotIds: z.array(boundedId).min(1).max(8) }).strict(),
  z.object({ type: z.literal("isolate"), hotspotIds: z.array(boundedId).min(1).max(8) }).strict(),
  z.object({ type: z.literal("fadeOthers"), hotspotIds: z.array(boundedId).min(1).max(8) }).strict(),
  z.object({ type: z.literal("resetScene") }).strict(),
  z
    .object({ type: z.literal("setAnimation"), animation: boundedId, enabled: z.boolean() })
    .strict(),
  z.object({ type: z.literal("showLabels"), hotspotIds: z.array(boundedId).max(8).optional() }).strict(),
  z.object({ type: z.literal("hideLabels") }).strict(),
]);

export type SceneAction = z.infer<typeof SceneActionSchema>;

export const ChallengeTypeSchema = z.enum([
  "identify",
  "trace",
  "compare",
  "spatial_relation",
  "function_reasoning",
]);

export const ChallengeHintSchema = z
  .object({ level: z.union([z.literal(1), z.literal(2), z.literal(3)]), text: boundedText(240) })
  .strict();

export const ChallengeSchema = z
  .object({
    id: boundedId,
    sceneId: boundedId,
    type: ChallengeTypeSchema,
    prompt: boundedText(500),
    concepts: z.array(boundedId).min(1).max(8),
    targetHotspotIds: z.array(boundedId).min(1).max(8).optional(),
    expectedSequence: z.array(boundedId).min(1).max(12).optional(),
    hints: z.array(ChallengeHintSchema).min(1).max(3),
    difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  })
  .strict();

export type Challenge = z.infer<typeof ChallengeSchema>;
export type ChallengeHint = z.infer<typeof ChallengeHintSchema>;

export const MasterySignalSchema = z
  .object({
    conceptId: boundedId,
    category: z.enum(["identification", "function", "spatialRelation", "flowReasoning"]),
    delta: z.number().min(-1).max(1),
    evidence: boundedText(240),
  })
  .strict();

export type MasterySignal = z.infer<typeof MasterySignalSchema>;

export const TutorResponseSchema = z
  .object({
    answer: boundedText(1800),
    focus: boundedId.optional(),
    actions: z.array(SceneActionSchema).max(8).default([]),
    followUp: boundedText(400).optional(),
    challenge: ChallengeSchema.optional(),
    masterySignals: z.array(MasterySignalSchema).max(8).optional(),
    mode: z.enum(["live", "demo", "fallback"]).default("live"),
  })
  .strict();

export type TutorResponse = z.infer<typeof TutorResponseSchema>;

export const ChallengeAttemptSchema = z
  .object({
    challengeId: boundedId,
    sceneId: boundedId,
    conceptIds: z.array(boundedId).min(1).max(8),
    correct: z.boolean(),
    responseTimeMs: z.number().int().min(0).max(3_600_000),
    attempts: z.number().int().min(1).max(20),
    hintCount: z.number().int().min(0).max(3),
    selectedHotspotIds: z.array(boundedId).max(12),
    timestamp: z.string().datetime(),
  })
  .strict();

export type ChallengeAttempt = z.infer<typeof ChallengeAttemptSchema>;

export const MasteryScoreSchema = z
  .object({ score: z.number().min(0).max(1), confidence: z.number().min(0).max(1), attempts: z.number().int().min(0) })
  .strict();

export type MasteryScore = z.infer<typeof MasteryScoreSchema>;

export const MasteryProfileSchema = z
  .object({
    version: z.literal(1),
    concepts: z.record(boundedId, MasteryScoreSchema),
    categories: z.object({
      identification: MasteryScoreSchema,
      function: MasteryScoreSchema,
      spatialRelation: MasteryScoreSchema,
      flowReasoning: MasteryScoreSchema,
    }),
    completedChallengeIds: z.array(boundedId).max(200),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type MasteryProfile = z.infer<typeof MasteryProfileSchema>;
export type MasterySummary = Pick<MasteryProfile, "categories" | "concepts" | "updatedAt">;
