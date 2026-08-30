import type { CandidateInstrument, ResearchCandidate } from "@shared/domain/investment";
import type { RelatedEventFeed } from "@shared/domain/relatedEvent";

export interface RelatedEventFeedRequest {
  primaryInstrument: CandidateInstrument;
  researchCandidates: ResearchCandidate[];
  thesisObservation: string;
}

export interface RelatedEventRepository {
  getRelatedEvents(request: RelatedEventFeedRequest): Promise<RelatedEventFeed>;
}
