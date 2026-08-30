import { useEffect, useState } from "react";
import type { RelatedEventFeed } from "@shared/domain/relatedEvent";
import type {
  RelatedEventFeedRequest,
  RelatedEventRepository,
} from "../../../data/repositories/RelatedEventRepository";

export function useRelatedEvents(repository: RelatedEventRepository, request: RelatedEventFeedRequest | null) {
  const [feed, setFeed] = useState<RelatedEventFeed | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setError(null);
    if (!request) {
      setFeed(null);
      return () => { active = false; };
    }

    repository.getRelatedEvents(request)
      .then((nextFeed) => {
        if (active) setFeed(nextFeed);
      })
      .catch(() => {
        if (active) setError("目前無法載入關聯事件，請稍後再試。");
      });

    return () => { active = false; };
  }, [repository, request]);

  return { feed, error };
}
