import type {
  AllocationItem,
  CandidateInstrument,
  InvestmentGoal,
  PlanPolicy,
  PlanResearchSuggestion,
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

export const demoPlanPolicy: PlanPolicy = {
  feasibilityStatus: "可規劃",
  feasibilityHeadline: "依目前條件，這份規劃具備執行空間",
  feasibilitySummary: "八年期限有助分散短期波動，但仍需要保留資金彈性並限制成長部位的集中程度。",
  feasibilityReasons: [
    "目標期限為八年，可用較長時間承受市場波動。",
    "每月投入 NT$ 18,000，適合以固定節奏累積資產。",
    "資金中途可能使用，因此保留 15% 彈性資金。",
  ],
  referenceAmount: 100000,
  percentageBasis: "總投資資產",
  singlePositionLimitPercentage: 10,
  industryReviewThresholdPercentage: 40,
  reviewTriggers: [
    "財務目標或預計完成時間改變",
    "每月可投入金額明顯增加或減少",
    "資金需要提前使用",
    "可承受的波動程度發生改變",
  ],
};

export const demoPlanResearchSuggestion: PlanResearchSuggestion = {
  summary: "依八年成長目標、每月投入與穩健風險意願，先建立分散核心，再以受限部位研究成長題材。",
  directions: [
    {
      id: "diversified-core",
      category: "分散型工具",
      title: "市場型或多資產核心",
      allocationRole: "核心配置",
      rationale: "用分散工具支撐長期目標，降低單一公司或單一產業對整體路徑的影響。",
      riskNote: "仍需比較費用、追蹤誤差、資產重疊與匯率風險。",
    },
    {
      id: "semiconductor-ai",
      category: "半導體・AI",
      title: "AI 基礎設施與先進製程",
      allocationRole: "成長配置",
      rationale: "八年期限容許研究長期成長題材，但應受單一部位 10% 與產業集中度限制。",
      riskNote: "需驗證景氣循環、估值、客戶集中與資本支出持續性。",
    },
    {
      id: "financial-quality",
      category: "金融類型",
      title: "現金流與防禦型金融",
      allocationRole: "觀察清單",
      rationale: "可作為成長題材之外的研究方向，觀察收益來源與景氣敏感度是否有助分散。",
      riskNote: "需比較利率敏感度、信用風險、資本適足率與股利穩定性。",
    },
  ],
  candidates: [
    {
      id: "candidate-tsmc",
      name: "台積電",
      symbol: "2330",
      category: "個股・半導體",
      rationale: "作為先進製程方向的研究案例，進一步檢驗成長條件、估值、風險與個人適合度。",
      dataStatus: "已有 Demo 研究資料",
      instrumentId: "tw-2330",
    },
    {
      id: "candidate-financial-etf",
      name: "金融類型 ETF",
      category: "ETF・金融",
      rationale: "先比較成分集中度、費用與利率敏感度，再決定是否建立具名候選標的。",
      dataStatus: "待進一步篩選",
    },
    {
      id: "candidate-ai-basket",
      name: "AI 基礎設施主題籃子",
      category: "主題・AI",
      rationale: "先拆解晶片、伺服器、網路與雲端供應鏈，避免只因熱門標籤形成投資結論。",
      dataStatus: "待進一步篩選",
    },
  ],
};

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
