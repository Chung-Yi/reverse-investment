export interface OnboardingQuestion {
  id: string;
  kicker: string;
  title: string;
  help: string;
  options: string[];
}

export const onboardingQuestions: OnboardingQuestion[] = [
  { id: "goal", kicker: "我的目標", title: "你最想完成哪一個財務目標？", help: "先選一個最重要的目標，之後仍可調整。", options: ["累積一筆資產", "準備購屋資金", "規劃退休生活"] },
  { id: "term", kicker: "目標期限", title: "希望多久後達成？", help: "期限會影響資金可以承受的波動與規劃方式。", options: ["3 年內", "4–7 年", "8–12 年"] },
  { id: "contribution", kicker: "投入能力", title: "每月可以穩定投入多少？", help: "請以不影響日常生活與緊急預備金為原則。", options: ["NT$ 5,000", "NT$ 10,000", "NT$ 18,000"] },
  { id: "experience", kicker: "投資經驗", title: "你目前的投資經驗接近哪一種？", help: "這只會影響解釋深度，不是能力評分。", options: ["剛開始了解", "有定期投入經驗", "會自行研究標的"] },
  { id: "volatility", kicker: "波動感受", title: "若資產短期下跌 15%，你的感受是？", help: "風險意願與實際承受能力會分開評估。", options: ["會非常不安", "需要重新確認理由", "可以依原計畫觀察"] },
  { id: "liquidity", kicker: "資金需求", title: "這筆資金中途需要使用的可能性？", help: "資金彈性會影響可投入比例與配置方式。", options: ["很可能需要", "可能需要一部分", "短期不會使用"] },
];

export const demoOnboardingAnswers: Record<string, string> = {
  goal: "累積一筆資產",
  term: "8–12 年",
  contribution: "NT$ 18,000",
  experience: "有定期投入經驗",
  volatility: "需要重新確認理由",
  liquidity: "可能需要一部分",
};
