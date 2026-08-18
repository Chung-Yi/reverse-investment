export type AssessmentLevel = "資料不足" | "仍需補充" | "條件較完整" | "條件充分";
export type DimensionLevel = "偏低" | "中等" | "偏高";

export function describeAssessmentScore(score: number): AssessmentLevel {
  if (score >= 80) return "條件充分";
  if (score >= 65) return "條件較完整";
  if (score >= 50) return "仍需補充";
  return "資料不足";
}

export function describeDimensionScore(score: number): DimensionLevel {
  if (score >= 70) return "偏高";
  if (score >= 50) return "中等";
  return "偏低";
}
