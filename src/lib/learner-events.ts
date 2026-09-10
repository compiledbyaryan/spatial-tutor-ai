import { z } from "zod";

import { ChallengeAttemptSchema } from "./tutor-contracts";

const base = z.object({ sceneId: z.string().min(1).max(80), timestamp: z.string().datetime() });

export const LearnerEventSchema = z.discriminatedUnion("type", [
  base.extend({ type: z.literal("scene_opened") }).strict(),
  base.extend({ type: z.literal("hotspot_selected"), hotspotId: z.string().min(1).max(80) }).strict(),
  base.extend({ type: z.literal("question_asked"), question: z.string().min(1).max(600) }).strict(),
  base.extend({ type: z.literal("challenge_started"), challengeId: z.string().min(1).max(80) }).strict(),
  base.extend({ type: z.literal("challenge_attempt"), attempt: ChallengeAttemptSchema }).strict(),
  base.extend({ type: z.literal("hint_requested"), challengeId: z.string().min(1).max(80), level: z.number().int().min(1).max(3) }).strict(),
  base.extend({ type: z.literal("challenge_completed"), challengeId: z.string().min(1).max(80) }).strict(),
  base.extend({ type: z.literal("scene_action_executed"), actionType: z.string().min(1).max(40) }).strict(),
]);

export type LearnerEvent = z.infer<typeof LearnerEventSchema>;

export function appendLearnerEvent(events: LearnerEvent[], event: unknown, limit = 200): LearnerEvent[] {
  const parsed = LearnerEventSchema.parse(event);
  return [...events, parsed].slice(-Math.max(1, Math.min(limit, 500)));
}

