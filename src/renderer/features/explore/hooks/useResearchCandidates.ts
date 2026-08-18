import { useCallback, useEffect, useState } from "react";
import type {
  InstrumentSearchFilters,
  ResearchCandidate,
  ResearchInstrument,
} from "@shared/domain/investment";
import type { ResearchCandidateRepository } from "../../../data/repositories/ResearchCandidateRepository";

export function useResearchCandidates(repository: ResearchCandidateRepository) {
  const [candidates, setCandidates] = useState<ResearchCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyzingIds, setAnalyzingIds] = useState<string[]>([]);

  const reload = useCallback(async () => {
    try {
      setCandidates(await repository.getCandidates());
      setError(null);
    } catch {
      setError("候選研究標的載入失敗，請稍後再試。");
    } finally {
      setLoading(false);
    }
  }, [repository]);

  useEffect(() => { void reload(); }, [reload]);

  const search = useCallback(
    (query: string, filters: InstrumentSearchFilters): Promise<ResearchInstrument[]> => repository.searchInstruments(query, filters),
    [repository],
  );

  const addCandidate = useCallback(async (instrumentId: string) => {
    await repository.addCandidate(instrumentId);
    await reload();
  }, [repository, reload]);

  const removeCandidate = useCallback(async (candidateId: string) => {
    try {
      await repository.removeCandidate(candidateId);
      await reload();
    } catch {
      setError("無法移除候選研究標的，請稍後再試。");
    }
  }, [repository, reload]);

  const requestAnalysis = useCallback(async (candidateId: string) => {
    setAnalyzingIds((current) => [...current, candidateId]);
    try {
      await repository.requestAnalysis(candidateId);
      await reload();
    } catch {
      setError("目前無法完成分析，請稍後再試。");
    } finally {
      setAnalyzingIds((current) => current.filter((id) => id !== candidateId));
    }
  }, [repository, reload]);

  return {
    candidates,
    loading,
    error,
    analyzingIds,
    search,
    addCandidate,
    removeCandidate,
    requestAnalysis,
  };
}
