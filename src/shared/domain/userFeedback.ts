export type SatisfactionRating = 1 | 2 | 3 | 4 | 5;

export interface UserFeedback {
  id: string;
  rating: SatisfactionRating;
  comment: string;
  route: string;
  createdAt: string;
}

export type SaveUserFeedbackInput = Pick<UserFeedback, "rating" | "comment" | "route">;
