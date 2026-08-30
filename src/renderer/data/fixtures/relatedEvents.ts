import type { ResearchCandidate } from "@shared/domain/investment";
import type { RelatedEventFeed } from "@shared/domain/relatedEvent";
import type { RelatedEventFeedRequest } from "../repositories/RelatedEventRepository";
import { importantChangeSnapshot } from "./demoInvestment";

type EventTarget = Pick<ResearchCandidate, "symbol" | "name" | "category"> & {
  directionTitle?: string;
};

export function buildRelatedEventFeed({
  primaryInstrument,
  researchCandidates,
  thesisObservation,
}: RelatedEventFeedRequest): RelatedEventFeed {
  const primaryTarget = researchCandidates.find((item) => item.symbol === primaryInstrument.symbol)
    ?? primaryInstrument;
  const otherTargets: EventTarget[] = researchCandidates.filter((item) => item.symbol !== primaryTarget.symbol);
  const secondaryTarget = otherTargets[0] ?? primaryTarget;
  const observation = thesisObservation.trim() || "尚未建立重要觀察條件";

  return {
    dataStatus: "非即時資訊",
    events: [
      {
        id: "related-event-margin-outlook",
        title: importantChangeSnapshot.title,
        happened: importantChangeSnapshot.happened,
        interpretation: "獲利率展望可能正常化，但目前資訊尚不足以否定長期需求假設。",
        impact: "論點影響",
        severity: importantChangeSnapshot.severity,
        source: importantChangeSnapshot.source,
        dataAsOf: importantChangeSnapshot.dataAsOf,
        dataStatus: "非即時資訊",
        affectedInstrument: { symbol: primaryTarget.symbol, name: primaryTarget.name },
        affectedAssumption: importantChangeSnapshot.assumption,
        goalImpact: importantChangeSnapshot.goalImpact,
      },
      {
        id: "related-event-market-role",
        title: `市場波動變化下，${secondaryTarget.name} 的配置角色需要重新確認`,
        happened: "市場波動幅度與原先研究情境不同，需要重新確認這項標的在整體配置中的角色。",
        interpretation: "這項變化先影響配置角色的理解，不直接形成買賣結論。",
        impact: "風險變化",
        severity: "注意",
        source: { publisher: "研究資料整理", title: "市場波動情境" },
        dataAsOf: "2026-08-08",
        dataStatus: "非即時資訊",
        affectedInstrument: { symbol: secondaryTarget.symbol, name: secondaryTarget.name },
        affectedAssumption: `${secondaryTarget.name} 仍符合原先設定的配置用途`,
        goalImpact: "需要確認配置角色是否仍符合目標期限、風險承受能力與集中度限制。",
      },
      {
        id: "related-event-observation",
        title: `持續觀察：${observation}`,
        happened: "目前尚未確認條件已成立，系統會保留這項觀察並持續比對後續資料。",
        interpretation: "這是使用者設定的重新檢視條件，不是市場預測或投資指令。",
        impact: "重要觀察",
        severity: "資訊",
        source: { publisher: "心跳追蹤", title: "使用者設定的觀察條件" },
        dataAsOf: "2026-08-08",
        dataStatus: "非即時資訊",
        affectedInstrument: { symbol: primaryTarget.symbol, name: primaryTarget.name },
        affectedAssumption: observation,
        goalImpact: "條件成立時，回到原始論點與個人規劃重新檢視。",
      },
    ],
  };
}
