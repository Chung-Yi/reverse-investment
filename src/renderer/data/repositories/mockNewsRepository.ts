import { buildResearchNewsFeed } from "../fixtures/researchNewsFeed";
import type { NewsRepository } from "./NewsRepository";

export const mockNewsRepository: NewsRepository = {
  async getFeed(request) {
    return structuredClone(buildResearchNewsFeed(request));
  },
};
