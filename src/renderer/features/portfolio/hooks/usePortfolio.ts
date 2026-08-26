import { useCallback, useEffect, useState } from "react";
import type { PortfolioPositionInput, SimulatedPortfolio } from "@shared/domain/investment";
import type { PortfolioRepository } from "../../../data/repositories/PortfolioRepository";

export function usePortfolio(repository: PortfolioRepository) {
  const [portfolio, setPortfolio] = useState<SimulatedPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setPortfolio(await repository.getPortfolio());
      setError(null);
    } catch {
      setError("目前無法載入資產資料，請稍後再試。");
    } finally {
      setLoading(false);
    }
  }, [repository]);

  useEffect(() => { void reload(); }, [reload]);

  const savePosition = useCallback(async (input: PortfolioPositionInput) => {
    try {
      await repository.savePosition(input);
      await reload();
      return true;
    } catch (reason) {
      setError(reason instanceof Error && reason.message === "position_already_exists"
        ? "這個標的已在模擬持倉中，可以直接編輯原有資料。"
        : "持倉資料未能儲存，請確認輸入內容後再試一次。");
      return false;
    }
  }, [repository, reload]);

  const removePosition = useCallback(async (positionId: string) => {
    try {
      await repository.removePosition(positionId);
      await reload();
    } catch {
      setError("目前無法移除這筆模擬持倉，請稍後再試。");
    }
  }, [repository, reload]);

  const removePositions = useCallback(async (positionIds: string[]) => {
    try {
      await repository.removePositions(positionIds);
      await reload();
      return true;
    } catch {
      setError("目前無法移除選取的模擬持倉，請稍後再試。");
      return false;
    }
  }, [repository, reload]);

  return { portfolio, loading, error, clearError: () => setError(null), savePosition, removePosition, removePositions };
}
