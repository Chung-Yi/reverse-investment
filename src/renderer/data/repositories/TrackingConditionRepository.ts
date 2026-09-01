import type { TrackingTarget } from "@shared/domain/tracking";
import type { SaveTrackingConditionInput, TrackingCondition, TrackingConditionSetup } from "@shared/domain/trackingCondition";

export interface TrackingConditionRepository {
  getSetup(target: TrackingTarget): Promise<TrackingConditionSetup>;
  save(target: TrackingTarget, input: SaveTrackingConditionInput): Promise<TrackingCondition>;
  remove(trackingId: string, conditionId: string): Promise<void>;
}
