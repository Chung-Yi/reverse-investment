import type {
  AllocationItem,
  CandidateInstrument,
  InvestmentGoal,
  RiskProfile,
  ThesisCard,
} from "@shared/domain/investment";

export interface InvestmentRepository {
  getGoal(): Promise<InvestmentGoal>;
  getRiskProfile(): Promise<RiskProfile>;
  getAllocations(): Promise<AllocationItem[]>;
  getCandidates(): Promise<CandidateInstrument[]>;
  getThesis(): Promise<ThesisCard>;
}
