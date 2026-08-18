import type { RiskLevel } from "@shared/domain/investment";
import type { InvestmentData } from "../../hooks/useInvestmentData";

const termConfig: Record<string, { years: number; score: number }> = {
  "3 年內": { years: 3, score: 35 },
  "4–7 年": { years: 6, score: 60 },
  "8–12 年": { years: 8, score: 80 },
};

const contributionConfig: Record<string, number> = {
  "NT$ 5,000": 5_000,
  "NT$ 10,000": 10_000,
  "NT$ 18,000": 18_000,
};

const willingnessConfig: Record<string, { level: RiskLevel; score: number; growthPercentage: number }> = {
  "會非常不安": { level: "保守", score: 35, growthPercentage: 15 },
  "需要重新確認理由": { level: "穩健", score: 62, growthPercentage: 25 },
  "可以依原計畫觀察": { level: "成長", score: 80, growthPercentage: 30 },
};

const experienceScore: Record<string, number> = {
  "剛開始了解": 30,
  "有定期投入經驗": 50,
  "會自行研究標的": 75,
};

const liquidityConfig: Record<string, { score: number; reservePercentage: number }> = {
  "很可能需要": { score: 35, reservePercentage: 25 },
  "可能需要一部分": { score: 68, reservePercentage: 15 },
  "短期不會使用": { score: 82, reservePercentage: 10 },
};

const growthNeedScore: Record<string, number> = {
  "累積一筆資產": 72,
  "準備購屋資金": 58,
  "規劃退休生活": 65,
};

function capacityFromTerm(years: number): RiskLevel {
  if (years <= 3) return "保守";
  if (years <= 7) return "穩健";
  return "成長";
}

export function buildPersonalizedInvestmentData(base: InvestmentData, answers: Record<string, string>): InvestmentData {
  const data = structuredClone(base);
  const goalName = answers.goal ?? data.goal.name;
  const term = termConfig[answers.term] ?? { years: data.goal.years, score: data.profile.dimensions[1]?.value ?? 60 };
  const contribution = contributionConfig[answers.contribution] ?? data.goal.monthlyContribution;
  const willingness = willingnessConfig[answers.volatility] ?? { level: data.profile.willingness, score: data.profile.dimensions[2]?.value ?? 60, growthPercentage: data.allocations[1]?.percentage ?? 25 };
  const liquidity = liquidityConfig[answers.liquidity] ?? { score: data.profile.dimensions[3]?.value ?? 60, reservePercentage: data.allocations[2]?.percentage ?? 15 };
  const longTermPercentage = 100 - willingness.growthPercentage - liquidity.reservePercentage;

  data.goal = { ...data.goal, name: goalName, years: term.years, monthlyContribution: contribution };
  data.profile = {
    ...data.profile,
    willingness: willingness.level,
    capacity: capacityFromTerm(term.years),
    dimensions: [
      { label: "成長需求", value: growthNeedScore[goalName] ?? 60 },
      { label: "投資期限", value: term.score },
      { label: "波動承受", value: willingness.score },
      { label: "資金彈性", value: liquidity.score },
      { label: "投資經驗", value: experienceScore[answers.experience] ?? 45 },
    ],
  };
  data.allocations = [
    { ...data.allocations[0], percentage: longTermPercentage, description: `用分散方式支持 ${term.years} 年後的「${goalName}」` },
    { ...data.allocations[1], percentage: willingness.growthPercentage, description: `依「${answers.volatility ?? "目前波動感受"}」保留研究型部位` },
    { ...data.allocations[2], percentage: liquidity.reservePercentage, description: `考量「${answers.liquidity ?? "目前資金需求"}」保留資金彈性` },
  ];
  data.planPolicy = {
    ...data.planPolicy,
    feasibilitySummary: `${term.years} 年期限與每月投入 ${answers.contribution ?? `NT$ ${contribution.toLocaleString("zh-TW")}`} 提供規劃基礎，仍需依資金需求保留彈性。`,
    feasibilityReasons: [
      `目標為「${goalName}」，預計期限約 ${term.years} 年。`,
      `每月可投入 ${answers.contribution ?? `NT$ ${contribution.toLocaleString("zh-TW")}`}。`,
      `資金使用需求為「${answers.liquidity ?? "尚待確認"}」，規劃中保留 ${liquidity.reservePercentage}% 資金。`,
    ],
  };
  data.planResearchSuggestion = {
    ...data.planResearchSuggestion,
    summary: `依「${goalName}」、每月投入 ${answers.contribution ?? `NT$ ${contribution.toLocaleString("zh-TW")}`} 與${willingness.level}風險意願，先建立分散方向，再研究受限部位。`,
    directions: data.planResearchSuggestion.directions.map((direction) => ({
      ...direction,
      rationale: direction.rationale.replaceAll("八年", `${term.years} 年`),
    })),
  };
  return data;
}
