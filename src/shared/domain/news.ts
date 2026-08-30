export type NewsImpact = "論點影響" | "風險變化" | "重要觀察" | "產業脈絡" | "市場總經";

export interface NewsInstrumentReference {
  symbol: string;
  name: string;
}

export interface NewsEvent {
  id: string;
  title: string;
  source: string;
  updateLabel: string;
  summary: string;
  impact: NewsImpact;
  affectedContext: string;
}

export interface NewsFeed {
  instruments: NewsInstrumentReference[];
  events: NewsEvent[];
  dataStatus: "非即時資訊" | "即時資訊";
}
