import type { SatisfactionRating, UserFeedback } from "@shared/domain/userFeedback";
import type { UserFeedbackRepository } from "./UserFeedbackRepository";

const storageKey = "reverse-investment:user-feedback:v1";
const promptUnlockedStorageKey = "reverse-investment:user-feedback-prompt-unlocked:v1";

function isRating(value: unknown): value is SatisfactionRating {
  return Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 5;
}

function validateFeedback(value: unknown): UserFeedback | null {
  if (!value || typeof value !== "object") return null;
  const feedback = value as Partial<UserFeedback>;
  if (
    typeof feedback.id !== "string"
    || !isRating(feedback.rating)
    || typeof feedback.comment !== "string"
    || typeof feedback.route !== "string"
    || typeof feedback.createdAt !== "string"
  ) return null;
  return feedback as UserFeedback;
}

function readStoredFeedback(): UserFeedback[] {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.map(validateFeedback).filter((item): item is UserFeedback => item !== null) : [];
  } catch {
    return [];
  }
}

export const localUserFeedbackRepository: UserFeedbackRepository = {
  list: readStoredFeedback,
  save(input) {
    const feedback: UserFeedback = {
      ...input,
      comment: input.comment.trim(),
      id: globalThis.crypto?.randomUUID?.() ?? `feedback-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(storageKey, JSON.stringify([...readStoredFeedback(), feedback]));
    } catch {
      // Keep the current interaction usable when local device storage is unavailable.
    }
    return feedback;
  },
  isPromptUnlocked() {
    try {
      return window.localStorage.getItem(promptUnlockedStorageKey) === "true";
    } catch {
      return false;
    }
  },
  unlockPrompt() {
    try {
      window.localStorage.setItem(promptUnlockedStorageKey, "true");
    } catch {
      // The current React state still unlocks the entry when device storage is unavailable.
    }
  },
};
