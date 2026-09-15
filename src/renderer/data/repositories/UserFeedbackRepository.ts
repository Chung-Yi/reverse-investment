import type { SaveUserFeedbackInput, UserFeedback } from "@shared/domain/userFeedback";

export interface UserFeedbackRepository {
  list(): UserFeedback[];
  save(input: SaveUserFeedbackInput): UserFeedback;
  isPromptUnlocked(): boolean;
  unlockPrompt(): void;
}
