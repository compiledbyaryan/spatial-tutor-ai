import { z } from "zod";

import { LearnerEventSchema, type LearnerEvent } from "./learner-events";
import { createMasteryProfile } from "./mastery-engine";
import {
  ChallengeAttemptSchema,
  MasteryProfileSchema,
  type ChallengeAttempt,
  type MasteryProfile,
} from "./tutor-contracts";

const STORAGE_KEY = "spatia.learning.v1";
const StoredLearningStateSchema = z
  .object({
    mastery: MasteryProfileSchema,
    attempts: z.array(ChallengeAttemptSchema).max(50),
    events: z.array(LearnerEventSchema).max(200),
  })
  .strict();

export type LearningState = { mastery: MasteryProfile; attempts: ChallengeAttempt[]; events: LearnerEvent[] };

export function createLearningState(): LearningState {
  return { mastery: createMasteryProfile(), attempts: [], events: [] };
}

export function loadLearningState(storage: Pick<Storage, "getItem"> | undefined): LearningState {
  if (!storage) return createLearningState();
  try {
    const value = JSON.parse(storage.getItem(STORAGE_KEY) ?? "null") as unknown;
    const object = StoredLearningStateSchema.safeParse(value);
    return object.success ? object.data : createLearningState();
  } catch {
    return createLearningState();
  }
}

export function saveLearningState(storage: Pick<Storage, "setItem"> | undefined, state: LearningState): void {
  if (!storage) return;
  const safeState = {
    mastery: MasteryProfileSchema.parse(state.mastery),
    attempts: state.attempts.slice(-50),
    events: state.events.slice(-200).map((event) => LearnerEventSchema.parse(event)),
  };
  storage.setItem(STORAGE_KEY, JSON.stringify(safeState));
}
