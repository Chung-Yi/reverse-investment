export type AgentEvent =
  | { type: "message.delta"; requestId: string; delta: string }
  | { type: "message.completed"; requestId: string; message: string }
  | { type: "agent.error"; requestId: string; message: string };

export interface AgentContextFact {
  key: string;
  label: string;
  value: string;
}

export interface AgentContextDetails {
  focus?: {
    kind: "trackingConditions" | "relatedEvent";
    id: string;
    label: string;
  };
  facts?: AgentContextFact[];
}

export interface AgentMessagePayload {
  message: string;
  context: AgentContextDetails & {
    route: string;
    screenTitle: string;
  };
}

export interface AgentRequest {
  requestId: string;
}
