export type TrackingAttentionLevel = "穩定" | "注意" | "重要";

export interface TrackingTarget {
  trackingId: string;
  thesisId: string;
  instrument: {
    id: string;
    symbol: string;
    name: string;
    category: string;
  };
  thesisReason: string;
  validityScore: number;
  suitabilityScore: number;
  observation: string;
  attentionLevel: TrackingAttentionLevel;
  relatedEventCount: number;
  updatedAt: string;
}
