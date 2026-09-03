export type ImportantChangeReviewAction = "keep" | "updateThesis" | "updateTracking" | "updatePlan";

export interface ImportantChangeReview {
  id: string;
  eventId: string;
  eventTitle: string;
  trackingId: string;
  thesisId: string;
  instrument: {
    id: string;
    symbol: string;
    name: string;
  };
  action: ImportantChangeReviewAction;
  actionLabel: string;
  note: string;
  previousValue?: string;
  updatedValue?: string;
  createdAt: string;
}

export type SaveImportantChangeReviewInput = Omit<ImportantChangeReview, "id" | "createdAt">;

export interface ImportantChangeReviewFilter {
  eventId?: string;
  action?: ImportantChangeReviewAction;
}
