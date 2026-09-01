import type { TrackingTarget } from "./tracking";

export type TrackingConditionKind = "price" | "priceChange" | "keyMetric" | "importantEvent" | "portfolio";
export type TrackingConditionComparator = "below" | "above" | "changeAtLeast" | "eventOccurs";

export interface TrackingConditionOption {
  id: string;
  label: string;
  unit?: string;
  defaultThreshold?: number;
  supportedComparators: TrackingConditionComparator[];
}

export interface TrackingConditionDefinition {
  kind: TrackingConditionKind;
  label: string;
  description: string;
  options: TrackingConditionOption[];
}

export interface TrackingCondition {
  id: string;
  trackingId: string;
  kind: TrackingConditionKind;
  kindLabel: string;
  optionId: string;
  optionLabel: string;
  comparator: TrackingConditionComparator;
  threshold?: number;
  unit?: string;
  summary: string;
  enabled: boolean;
  updatedAt: string;
}

export interface TrackingConditionSetup {
  target: TrackingTarget;
  definitions: TrackingConditionDefinition[];
  activeConditions: TrackingCondition[];
}

export interface SaveTrackingConditionInput {
  kind: TrackingConditionKind;
  optionId: string;
  comparator: TrackingConditionComparator;
  threshold?: number;
}
