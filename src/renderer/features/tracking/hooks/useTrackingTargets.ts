import { useEffect, useState } from "react";
import type { TrackingTarget } from "@shared/domain/tracking";
import type { TrackingRepository, TrackingTargetRequest } from "../../../data/repositories/TrackingRepository";

export function useTrackingTargets(repository: TrackingRepository, request: TrackingTargetRequest) {
  const [targets, setTargets] = useState<TrackingTarget[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setError(null);
    repository.getTrackingTargets(request)
      .then((items) => { if (active) setTargets(items); })
      .catch(() => {
        if (active) {
          setTargets([]);
          setError("目前無法載入追蹤標的，請稍後再試。");
        }
      });
    return () => { active = false; };
  }, [repository, request]);

  return { targets, error };
}
