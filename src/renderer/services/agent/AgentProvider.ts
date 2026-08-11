import type { AgentEvent, AgentMessagePayload, AgentRequest } from "@shared/contracts/agent";

export interface AgentProvider {
  submitMessage(payload: AgentMessagePayload): Promise<AgentRequest>;
  stop(requestId: string): void;
  onEvent(callback: (event: AgentEvent) => void): () => void;
}
