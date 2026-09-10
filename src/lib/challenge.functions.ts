import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { evaluateChallenge, getChallenge, getChallenges } from "./challenge-engine";
import { getScene } from "./scenes";
import { createMasteryProfile, getWeakConcepts, recommendNextChallenge, updateMastery } from "./mastery-engine";
import { MasteryProfileSchema } from "./tutor-contracts";

const ChallengeListInput = z.object({ sceneId: z.string().trim().min(1).max(80) }).strict();

const ChallengeSubmissionInput = z
  .object({
    challengeId: z.string().trim().min(1).max(80),
    selectedHotspotIds: z.array(z.string().trim().min(1).max(80)).max(12),
    responseTimeMs: z.number().int().min(0).max(3_600_000),
    attempts: z.number().int().min(1).max(20),
    hintCount: z.number().int().min(0).max(3),
    masteryProfile: MasteryProfileSchema.optional(),
  })
  .strict();

export const listChallenges = createServerFn({ method: "GET" })
  .validator((input: unknown) => ChallengeListInput.parse(input))
  .handler(({ data }) => {
    if (!getScene(data.sceneId)) throw new Error("Unknown learning module.");
    return getChallenges(data.sceneId);
  });

export const submitChallenge = createServerFn({ method: "POST" })
  .validator((input: unknown) => ChallengeSubmissionInput.parse(input))
  .handler(({ data }) => {
    const challenge = getChallenge(data.challengeId);
    if (!challenge) throw new Error("Unknown challenge.");
    const scene = getScene(challenge.sceneId);
    if (!scene) throw new Error("Challenge references an unknown learning module.");
    const allowedIds = new Set(scene.hotspots.map((hotspot) => hotspot.id));
    if (data.selectedHotspotIds.some((id) => !allowedIds.has(id))) throw new Error("Challenge answer contains an unknown structure.");

    const evaluation = evaluateChallenge({
      challenge,
      selectedHotspotIds: data.selectedHotspotIds,
      responseTimeMs: data.responseTimeMs,
      attempts: data.attempts,
      hintCount: data.hintCount,
    });
    const masteryProfile = updateMastery(data.masteryProfile ?? createMasteryProfile(), evaluation.attempt, challenge);
    return {
      evaluation,
      masteryProfile,
      weakConcepts: getWeakConcepts(masteryProfile),
      recommendation: recommendNextChallenge(masteryProfile, challenge.sceneId),
    };
  });
