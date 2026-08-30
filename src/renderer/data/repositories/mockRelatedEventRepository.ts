import { buildRelatedEventFeed } from "../fixtures/relatedEvents";
import type { RelatedEventRepository } from "./RelatedEventRepository";

export const mockRelatedEventRepository: RelatedEventRepository = {
  async getRelatedEvents(request) {
    return structuredClone(buildRelatedEventFeed(request));
  },
};
