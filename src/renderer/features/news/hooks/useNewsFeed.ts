import { useEffect, useState } from "react";
import type { NewsFeed } from "@shared/domain/news";
import type { NewsFeedRequest, NewsRepository } from "../../../data/repositories/NewsRepository";

export function useNewsFeed(repository: NewsRepository, request: NewsFeedRequest) {
  const [feed, setFeed] = useState<NewsFeed | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setError(null);

    repository.getFeed(request)
      .then((nextFeed) => {
        if (active) setFeed(nextFeed);
      })
      .catch(() => {
        if (active) setError("目前無法載入新聞資訊，請稍後再試。");
      });

    return () => { active = false; };
  }, [repository, request]);

  return { feed, error };
}
