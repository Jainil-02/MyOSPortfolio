export const reservedAppIds = [
  "ai-assistant",
  "mcp-hub",
  "agent-workspace",
  "knowledge-base",
  "memory-center",
  "prompt-library",
  "tool-registry",
] as const;

export type ReservedAppId = (typeof reservedAppIds)[number];
