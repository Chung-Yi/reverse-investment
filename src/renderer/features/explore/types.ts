export type ExploreTab = "directions" | "candidates";
export type CandidateOriginFilter = "all" | "plan" | "user";

export interface ExploreViewState {
  tab: ExploreTab;
  selectedDirection: string;
  originFilter: CandidateOriginFilter;
  directionPage: number;
  candidatePage: number;
}

export const initialExploreViewState: ExploreViewState = {
  tab: "directions",
  selectedDirection: "all",
  originFilter: "all",
  directionPage: 1,
  candidatePage: 1,
};
