export type RelatedEventImpact = "論點影響" | "風險變化" | "重要觀察";
export type RelatedEventSeverity = "資訊" | "注意" | "重要";
export type RelatedEventDataStatus = "非即時資訊" | "即時資訊";

export interface RelatedEventSource {
  publisher: string;
  title: string;
  url?: string;
}

export interface RelatedEventInstrument {
  symbol: string;
  name: string;
}

export interface RelatedEvent {
  id: string;
  title: string;
  happened: string;
  interpretation: string;
  impact: RelatedEventImpact;
  severity: RelatedEventSeverity;
  source: RelatedEventSource;
  dataAsOf: string;
  dataStatus: RelatedEventDataStatus;
  affectedInstrument: RelatedEventInstrument;
  affectedAssumption: string;
  goalImpact: string;
}

export interface RelatedEventFeed {
  events: RelatedEvent[];
  dataStatus: RelatedEventDataStatus;
}
