import type { ResearchCandidate } from "@shared/domain/investment";
import {
  demoCandidateAnalysis,
  demoInstrumentCatalog,
  demoPlanResearchCandidates,
} from "../fixtures/instrumentCatalog";
import type { ResearchCandidateRepository } from "./ResearchCandidateRepository";

const storageKey = "reverse-investment:user-research-candidates";

function readUserCandidates(): ResearchCandidate[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is ResearchCandidate => (
      typeof item === "object" && item !== null && "candidateId" in item && "origin" in item && item.origin === "user"
    ));
  } catch {
    return [];
  }
}

function writeUserCandidates(candidates: ResearchCandidate[]) {
  if (typeof window !== "undefined") window.localStorage.setItem(storageKey, JSON.stringify(candidates));
}

function allCandidates() {
  const planInstrumentIds = new Set(demoPlanResearchCandidates.map((candidate) => candidate.id));
  const uniqueUserCandidates = readUserCandidates().filter((candidate) => !planInstrumentIds.has(candidate.id));
  return [...structuredClone(demoPlanResearchCandidates), ...uniqueUserCandidates];
}

export const mockResearchCandidateRepository: ResearchCandidateRepository = {
  async getCandidates() {
    return allCandidates();
  },

  async searchInstruments(query, filters) {
    const normalizedQuery = query.trim().toLocaleLowerCase("zh-TW");
    return structuredClone(demoInstrumentCatalog.filter((instrument) => {
      const matchesQuery = !normalizedQuery
        || instrument.symbol.toLocaleLowerCase("zh-TW").includes(normalizedQuery)
        || instrument.name.toLocaleLowerCase("zh-TW").includes(normalizedQuery);
      const matchesMarket = !filters.market || instrument.market === filters.market;
      const matchesType = !filters.instrumentType || instrument.instrumentType === filters.instrumentType;
      return matchesQuery && matchesMarket && matchesType;
    }));
  },

  async addCandidate(instrumentId) {
    const existing = allCandidates().find((candidate) => candidate.id === instrumentId);
    if (existing) return structuredClone(existing);
    const instrument = demoInstrumentCatalog.find((item) => item.id === instrumentId);
    if (!instrument) throw new Error("instrument_not_found");
    const candidate: ResearchCandidate = {
      ...instrument,
      candidateId: `user-${instrument.id}`,
      origin: "user",
      rationale: "由你加入研究清單，完成資料整理後顯示與目前規劃的關聯。",
      analysisStatus: "pending",
    };
    const users = readUserCandidates();
    writeUserCandidates([...users, candidate]);
    return structuredClone(candidate);
  },

  async removeCandidate(candidateId) {
    writeUserCandidates(readUserCandidates().filter((candidate) => candidate.candidateId !== candidateId));
  },

  async requestAnalysis(candidateId) {
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    const users = readUserCandidates();
    const candidate = users.find((item) => item.candidateId === candidateId);
    if (!candidate) throw new Error("candidate_not_found");
    const analysis = demoCandidateAnalysis[candidate.id];
    if (!analysis) throw new Error("analysis_not_available");
    const updated: ResearchCandidate = { ...candidate, ...analysis, analysisStatus: "ready" };
    writeUserCandidates(users.map((item) => item.candidateId === candidateId ? updated : item));
    return structuredClone(updated);
  },
};
