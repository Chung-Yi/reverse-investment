import { buildTrackingTargets } from "../fixtures/trackingTargets";
import type { TrackingRepository } from "./TrackingRepository";

export const mockTrackingRepository: TrackingRepository = {
  async getTrackingTargets(request) {
    return structuredClone(buildTrackingTargets(request));
  },
};
