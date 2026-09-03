import type {
  ImportantChangeReview,
  ImportantChangeReviewFilter,
  SaveImportantChangeReviewInput,
} from "@shared/domain/importantChangeReview";

export interface ImportantChangeReviewRepository {
  list(filter?: ImportantChangeReviewFilter): Promise<ImportantChangeReview[]>;
  save(input: SaveImportantChangeReviewInput): Promise<ImportantChangeReview>;
}
