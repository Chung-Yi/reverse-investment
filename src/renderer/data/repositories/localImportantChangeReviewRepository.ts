import type { ImportantChangeReview } from "@shared/domain/importantChangeReview";
import type { ImportantChangeReviewRepository } from "./ImportantChangeReviewRepository";

const storageKey = "reverse-investment.important-change-reviews.v1";

function readStored(): ImportantChangeReview[] {
  try {
    const value = window.localStorage.getItem(storageKey);
    return value ? JSON.parse(value) as ImportantChangeReview[] : [];
  } catch {
    return [];
  }
}

function writeStored(value: ImportantChangeReview[]) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Device-local persistence is best effort in Version 1.
  }
}

export const localImportantChangeReviewRepository: ImportantChangeReviewRepository = {
  async list(filter = {}) {
    const reviews = readStored()
      .filter((review) => !filter.eventId || review.eventId === filter.eventId)
      .filter((review) => !filter.action || review.action === filter.action)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    return structuredClone(reviews);
  },

  async save(input) {
    const review: ImportantChangeReview = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    writeStored([review, ...readStored()]);
    return structuredClone(review);
  },
};
