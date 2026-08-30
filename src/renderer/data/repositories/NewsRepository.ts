import type { CandidateInstrument, ResearchCandidate } from "@shared/domain/investment";
import type { NewsFeed } from "@shared/domain/news";

export interface NewsFeedRequest {
  primaryInstrument: CandidateInstrument;
  researchCandidates: ResearchCandidate[];
  thesisObservation: string;
}

export interface NewsRepository {
  getFeed(request: NewsFeedRequest): Promise<NewsFeed>;
}
