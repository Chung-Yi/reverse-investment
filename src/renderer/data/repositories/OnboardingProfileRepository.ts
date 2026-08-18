export interface SavedOnboardingProfile {
  answers: Record<string, string>;
  updatedAt: string;
}

export interface OnboardingProfileRepository {
  load(): SavedOnboardingProfile | null;
  save(answers: Record<string, string>): SavedOnboardingProfile;
}
