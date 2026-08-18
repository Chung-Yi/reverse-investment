import { onboardingQuestions } from "../fixtures/onboardingQuestions";
import type { OnboardingProfileRepository, SavedOnboardingProfile } from "./OnboardingProfileRepository";

const storageKey = "reverse-investment:onboarding-profile:v1";

function validateProfile(value: unknown): SavedOnboardingProfile | null {
  if (!value || typeof value !== "object") return null;
  const profile = value as Partial<SavedOnboardingProfile>;
  if (!profile.answers || typeof profile.answers !== "object" || typeof profile.updatedAt !== "string") return null;

  const answers: Record<string, string> = {};
  for (const question of onboardingQuestions) {
    const answer = profile.answers[question.id];
    if (typeof answer !== "string" || !question.options.includes(answer)) return null;
    answers[question.id] = answer;
  }
  return { answers, updatedAt: profile.updatedAt };
}

export const localOnboardingProfileRepository: OnboardingProfileRepository = {
  load() {
    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored ? validateProfile(JSON.parse(stored)) : null;
    } catch {
      return null;
    }
  },
  save(answers) {
    const profile = validateProfile({ answers, updatedAt: new Date().toISOString() });
    if (!profile) throw new Error("目標與條件尚未完整，無法儲存。");
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(profile));
    } catch {
      // The current session can still use the saved React state when device storage is unavailable.
    }
    return profile;
  },
};
