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
    id: "demo-global-quality",
    symbol: "DEMO-Q1",
    name: "全球品質成長組合（示範）",
    category: "成長配置",
    rationale: "用來展示如何從長期成長、企業品質與分散程度建立研究方向。",
    researchFit: 78,
    suitability: 71,
    summary: "示範資料顯示此組合具備中長期成長題材，但估值與產業集中仍需持續驗證。",
    metrics: [
      { label: "營收趨勢", value: "穩定成長", note: "競賽假資料" },
      { label: "估值位置", value: "中度偏高", note: "競賽假資料" },
      { label: "產業集中", value: "38%", note: "競賽假資料" },
      { label: "資料完整度", value: "82%", note: "Demo fixture" },
    ],
    evidence: ["示範企業獲利品質維持穩定", "長期需求假設仍有多項資料支持"],
    counterEvidence: ["估值已反映部分樂觀預期", "產業集中可能放大短期波動"],
    assumptions: ["獲利品質未明顯惡化", "產業集中維持在規劃上限內"],
  },
  {
    id: "demo-balanced-core",
    symbol: "DEMO-C1",
    name: "多資產核心組合（示範）",
    category: "核心配置",
    rationale: "用來展示較分散的核心配置如何連結目標期限與波動承受能力。",
    researchFit: 84,
    suitability: 86,
    summary: "示範資料呈現較佳分散度與較低波動，但預期成長性相對溫和。",
    metrics: [
      { label: "資產類別", value: "4 類", note: "競賽假資料" },
      { label: "波動程度", value: "中低", note: "競賽假資料" },
      { label: "集中度", value: "18%", note: "競賽假資料" },
      { label: "資料完整度", value: "88%", note: "Demo fixture" },
    ],
    evidence: ["資產來源較分散", "波動特徵符合核心配置定位"],
    counterEvidence: ["強勢市場中可能落後單一成長資產", "再平衡規則需要明確化"],
    assumptions: ["資產間相關性沒有同步大幅升高", "定期再平衡可以被持續執行"],
  },
];

export const demoThesis: ThesisCard = {
  id: "thesis-demo-001",
  instrumentId: "demo-global-quality",
  reason: "我關注它，是因為八年目標需要適度成長，但部位必須受集中度上限約束。",
  validityScore: 78,
  suitabilityScore: 71,
  status: "追蹤中",
  updatedAt: "2026-08-08",
};

export const demoImportantChange = {
  severity: "注意" as const,
  title: "產業集中度接近原先設定的觀察門檻",
  happened: "示範組合的單一產業占比由 34% 上升至 38%。",
  assumption: "產業集中維持在規劃上限內",
  goalImpact: "尚未改變八年目標，但可能提高短期波動。",
};
