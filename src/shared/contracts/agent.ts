export type AgentEvent =
  | { type: "message.delta"; requestId: string; delta: string }
  | { type: "message.completed"; requestId: string; message: string }
  | { type: "agent.error"; requestId: string; message: string };

export interface AgentMessagePayload {
  message: string;
  context: {
    route: string;
    screenTitle: string;
  };
}

export interface AgentRequest {
  requestId: string;
}
