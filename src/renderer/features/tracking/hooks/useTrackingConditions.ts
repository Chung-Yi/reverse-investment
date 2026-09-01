import { useCallback, useEffect, useState } from "react";
import type { TrackingTarget } from "@shared/domain/tracking";
import type { SaveTrackingConditionInput, TrackingConditionSetup } from "@shared/domain/trackingCondition";
import type { TrackingConditionRepository } from "../../../data/repositories/TrackingConditionRepository";

export function useTrackingConditions(repository: TrackingConditionRepository, target: TrackingTarget | null) {
  const [setup, setSetup] = useState<TrackingConditionSetup | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!target) {
      setSetup(null);
      return;
    }
    try {
      setError(null);
      setSetup(await repository.getSetup(target));
    } catch {
      setError("追蹤條件目前無法載入，請稍後再試。");
    }
  }, [repository, target]);

  useEffect(() => { void reload(); }, [reload]);

  const save = useCallback(async (input: SaveTrackingConditionInput) => {
    if (!target) return;
    await repository.save(target, input);
    await reload();
  }, [reload, repository, target]);

  const remove = useCallback(async (conditionId: string) => {
    if (!target) return;
    await repository.remove(target.trackingId, conditionId);
    await reload();
  }, [reload, repository, target]);

  return { setup, error, save, remove };
}
