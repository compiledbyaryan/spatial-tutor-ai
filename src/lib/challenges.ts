/** Compatibility facade: canonical challenge contracts and content live in backend modules. */
export { getChallenge, getChallenges as challengesForScene } from "./challenge-engine";
export { heartChallenges as challenges } from "./challenge-bank";
export type { Challenge } from "./tutor-contracts";

export const CHALLENGE_TYPE_LABEL = {
  identify: "Identify",
  trace: "Trace",
  compare: "Compare",
  spatial_relation: "Relationship",
  function_reasoning: "Reason",
} as const;
