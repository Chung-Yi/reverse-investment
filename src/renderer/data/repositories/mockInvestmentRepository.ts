import {
  demoAllocations,
  demoCandidates,
  demoGoal,
  demoRiskProfile,
  demoThesis,
} from "../fixtures/demoInvestment";
import type { InvestmentRepository } from "./InvestmentRepository";

export const mockInvestmentRepository: InvestmentRepository = {
  async getGoal() { return structuredClone(demoGoal); },
  async getRiskProfile() { return structuredClone(demoRiskProfile); },
  async getAllocations() { return structuredClone(demoAllocations); },
  async getCandidates() { return structuredClone(demoCandidates); },
  async getThesis() { return structuredClone(demoThesis); },
};
