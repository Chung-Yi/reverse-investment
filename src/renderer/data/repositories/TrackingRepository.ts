import type { CandidateInstrument, ThesisCard } from "@shared/domain/investment";
import type { TrackingTarget } from "@shared/domain/tracking";

export interface TrackingTargetRequest {
  primaryInstrument: CandidateInstrument;
  primaryThesis: ThesisCard;
  primaryObservation: string;
}

export interface TrackingRepository {
  getTrackingTargets(request: TrackingTargetRequest): Promise<TrackingTarget[]>;
}
