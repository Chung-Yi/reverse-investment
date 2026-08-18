import type {
  InstrumentSearchFilters,
  ResearchCandidate,
  ResearchInstrument,
} from "@shared/domain/investment";

export interface ResearchCandidateRepository {
  getCandidates(): Promise<ResearchCandidate[]>;
  searchInstruments(query: string, filters: InstrumentSearchFilters): Promise<ResearchInstrument[]>;
  addCandidate(instrumentId: string): Promise<ResearchCandidate>;
  removeCandidate(candidateId: string): Promise<void>;
  requestAnalysis(candidateId: string): Promise<ResearchCandidate>;
}
