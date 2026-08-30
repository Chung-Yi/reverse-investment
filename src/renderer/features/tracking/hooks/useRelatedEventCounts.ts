import { useEffect, useState } from "react";
import type { TrackingTarget } from "@shared/domain/tracking";
import type { RelatedEventRepository } from "../../../data/repositories/RelatedEventRepository";

export function useRelatedEventCounts(
  repository: RelatedEventRepository,
  targets: TrackingTarget[],
) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let active = true;

    if (targets.length === 0) {
      setCounts({});
      return () => { active = false; };
    }

    Promise.all(
      targets.map(async (target) => {
        const feed = await repository.getRelatedEvents({ target });
        return [target.trackingId, feed.events.length] as const;
      }),
    )
      .then((entries) => {
        if (active) setCounts(Object.fromEntries(entries));
      })
      .catch(() => {
        if (active) setCounts({});
      });

    return () => { active = false; };
  }, [repository, targets]);

  return counts;
}
