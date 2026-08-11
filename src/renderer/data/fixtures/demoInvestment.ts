import type {
  AllocationItem,
  CandidateInstrument,
  InvestmentGoal,
  RiskProfile,
  ThesisCard,
} from "@shared/domain/investment";

export const demoGoal: InvestmentGoal = {
  name: "八年成長計畫",
  targetAmount: 3_000_000,
  currentAmount: 420_000,
  years: 8,
  monthlyContribution: 18_000,
};

export const demoRiskProfile: RiskProfile = {
  willingness: "穩健",
  capacity: "成長",
  required: "穩健",
  dimensions: [
    { label: "成長需求", value: 72 },
    { label: "投資期限", value: 80 },
    { label: "波動承受", value: 62 },
    { label: "資金彈性", value: 68 },
    { label: "投資經驗", value: 46 },
  ],
};

export const demoAllocations: AllocationItem[] = [
  { label: "核心配置", percentage: 60, description: "支撐八年目標的分散型長期配置", tone: "core" },
  { label: "成長配置", percentage: 25, description: "依成長需求保留的研究型部位", tone: "growth" },
  { label: "彈性資金", percentage: 15, description: "保留短期調整與生活資金彈性", tone: "liquid" },
];

export const demoCandidates: CandidateInstrument[] = [
  {
    id: "tw-2330",
    symbol: "2330",
    name: "台積電",
    category: "個股・半導體",
    rationale: "以官方季度財報檢視先進製程需求、獲利品質與單一個股風險是否符合長期成長目標。",
    researchFit: 78,
    suitability: 71,
    summary: "2026 年第二季營收與獲利維持成長，先進製程需求提供支持，但半導體循環、客戶需求與產能執行仍需持續驗證。",
    metrics: [
      { label: "Q2 合併營收", value: "NT$1.270 兆", note: "年增 36.0%" },
      { label: "毛利率", value: "67.7%", note: "2026 Q2" },
      { label: "稀釋 EPS", value: "NT$27.25", note: "年增 77.4%" },
      { label: "先進製程占比", value: "77%", note: "7 奈米及更先進" },
    ],
    evidence: [
      "2026 Q2 合併營收新台幣 1.27038 兆元，年增 36.0%",
      "2026 Q2 毛利率 67.7%，營業利益率 60.3%",
      "7 奈米及更先進製程占全季晶圓營收 77%",
    ],
    counterEvidence: [
      "半導體景氣循環與市場供需變化可能影響營運",
      "主要客戶訂單、產能管理與匯率變動仍是重要風險",
    ],
    assumptions: ["先進製程需求能持續支撐營收", "公司能維持技術領先並妥善管理產能"],
    dataStatus: "官方公開資料",
    dataAsOf: "2026-06-30",
    sources: [
      {
        title: "台積公司 2026 年第二季財務報告",
        publisher: "台灣積體電路製造股份有限公司",
        publishedAt: "2026-07-16",
        url: "https://investor.tsmc.com/chinese/quarterly-results/2026/q2",
      },
    ],
  },
];

export const demoThesis: ThesisCard = {
  id: "thesis-demo-001",
  instrumentId: "tw-2330",
  reason: "我關注台積電，是因為先進製程需求與獲利成長支持八年成長目標，但單一個股部位仍須受集中度上限約束。",
  validityScore: 78,
  suitabilityScore: 71,
  status: "追蹤中",
  updatedAt: "2026-08-08",
};

export const importantChangeSnapshot = {
  severity: "注意" as const,
  title: "第三季毛利率展望低於第二季實際值",
  happened: "2026 Q2 毛利率為 67.7%；公司對 Q3 的毛利率展望為 65% 至 67%。",
  assumption: "公司能維持技術領先並妥善管理產能",
  goalImpact: "尚未改變八年目標，但單一個股配置需要持續觀察獲利率與執行情況。",
  dataAsOf: "2026-07-16",
  source: {
    title: "台積公司 2026 年第二季財務報告",
    publisher: "台灣積體電路製造股份有限公司",
    url: "https://investor.tsmc.com/chinese/quarterly-results/2026/q2",
  },
};
