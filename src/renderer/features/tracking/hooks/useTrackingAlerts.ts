import { useEffect, useState } from "react";
import type { RelatedEvent } from "@shared/domain/relatedEvent";
import type { TrackingTarget } from "@shared/domain/tracking";
import type { RelatedEventRepository } from "../../../data/repositories/RelatedEventRepository";

export interface TrackingAlert {
  event: RelatedEvent;
  target: TrackingTarget;
}

const severityOrder: Record<RelatedEvent["severity"], number> = {
  重要: 0,
  注意: 1,
  資訊: 2,
};

export function useTrackingAlerts(repository: RelatedEventRepository, targets: TrackingTarget[]) {
  const [alerts, setAlerts] = useState<TrackingAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (targets.length === 0) {
      setAlerts([]);
      setLoading(false);
      setError(null);
      return () => { active = false; };
    }

    setLoading(true);
    setError(null);
    Promise.all(targets.map(async (target) => ({
      target,
      feed: await repository.getRelatedEvents({ target }),
    })))
      .then((results) => {
        if (!active) return;
        setAlerts(results
          .flatMap(({ target, feed }) => feed.events
            .filter((event) => event.status === "已觸發")
            .map((event) => ({ event, target })))
          .sort((left, right) => severityOrder[left.event.severity] - severityOrder[right.event.severity]));
      })
      .catch(() => {
        if (active) {
          setAlerts([]);
          setError("目前無法整理追蹤提醒，請稍後再試。");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [repository, targets]);

  return { alerts, loading, error };
}
