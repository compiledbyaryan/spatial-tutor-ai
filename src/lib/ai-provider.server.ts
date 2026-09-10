import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { z } from "zod";

const AiRuntimeConfigSchema = z.object({
  apiKey: z.string().min(1),
  baseURL: z.string().url(),
  model: z.string().min(1).max(160),
});

export type AiRuntimeConfig = z.infer<typeof AiRuntimeConfigSchema>;

export function getAiRuntimeConfig(env: NodeJS.ProcessEnv = process.env): AiRuntimeConfig {
  return AiRuntimeConfigSchema.parse({ apiKey: env["AI_API_KEY"], baseURL: env["AI_BASE_URL"], model: env["AI_MODEL"] });
}

export function createAiModel(config = getAiRuntimeConfig()) {
  const provider = createOpenAICompatible({
    name: "spatia-ai",
    apiKey: config.apiKey,
    baseURL: config.baseURL.replace(/\/$/, ""),
  });
  return provider(config.model);
}

export function isDemoMode(env: NodeJS.ProcessEnv = process.env): boolean {
  const explicit = env["DEMO_MODE"]?.trim().toLowerCase();
  if (explicit) return ["1", "true", "yes", "on"].includes(explicit);
  // A fresh clone with no secrets must take the guaranteed offline path.
  return !env["AI_API_KEY"]?.trim();
}
