export type RelatedEventImpact = "論點影響" | "風險變化" | "重要觀察";
export type RelatedEventSeverity = "資訊" | "注意" | "重要";
export type RelatedEventDataStatus = "非即時資訊" | "即時資訊";
export type RelatedEventType = "追蹤條件觸發" | "官方重要事件" | "關聯新聞" | "待驗證訊號";
export type RelatedEventStatus = "已觸發" | "待驗證";

export interface RelatedEventSource {
  publisher: string;
  title: string;
  url?: string;
}

export interface RelatedEventInstrument {
  symbol: string;
  name: string;
}

export interface RelatedEventTrigger {
  conditionId?: string;
  conditionKind?: TrackingConditionKind;
  optionId?: string;
  comparator?: TrackingConditionComparator;
  threshold?: number;
  unit?: string;
  label: string;
  detail: string;
  observed: string;
  difference: string;
}

export interface RelatedEvent {
  id: string;
  eventType: RelatedEventType;
  status: RelatedEventStatus;
  title: string;
  happened: string;
  interpretation: string;
  confirmedFacts: string[];
  verificationItems: string[];
  impact: RelatedEventImpact;
  severity: RelatedEventSeverity;
  source: RelatedEventSource;
  dataAsOf: string;
  dataStatus: RelatedEventDataStatus;
  trigger: RelatedEventTrigger;
  affectedInstrument: RelatedEventInstrument;
  affectedAssumption: string;
  goalImpact: string;
}

export interface RelatedEventFeed {
  events: RelatedEvent[];
  dataStatus: RelatedEventDataStatus;
}
import type { TrackingConditionComparator, TrackingConditionKind } from "./trackingCondition";
