import type { RelatedEventFeed } from "@shared/domain/relatedEvent";
import type { TrackingTarget } from "@shared/domain/tracking";

export interface RelatedEventFeedRequest {
  target: TrackingTarget;
}

export interface RelatedEventRepository {
  getRelatedEvents(request: RelatedEventFeedRequest): Promise<RelatedEventFeed>;
}
