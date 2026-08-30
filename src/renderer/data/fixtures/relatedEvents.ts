import type { RelatedEventFeed } from "@shared/domain/relatedEvent";
import type { RelatedEventFeedRequest } from "../repositories/RelatedEventRepository";
import { importantChangeSnapshot } from "./demoInvestment";

export function buildRelatedEventFeed({ target }: RelatedEventFeedRequest): RelatedEventFeed {
  const isPrimaryTarget = target.instrument.symbol === "2330";
  const mainEvent = isPrimaryTarget ? {
    title: importantChangeSnapshot.title,
    happened: importantChangeSnapshot.happened,
    interpretation: "獲利率展望可能正常化，但目前資訊尚不足以否定長期需求假設。",
    source: importantChangeSnapshot.source,
    dataAsOf: importantChangeSnapshot.dataAsOf,
    affectedAssumption: importantChangeSnapshot.assumption,
    goalImpact: importantChangeSnapshot.goalImpact,
  } : {
    title: `${target.instrument.name} 出現需要重新確認的追蹤訊號`,
    happened: `最新整理的市場與標的資料，與 ${target.instrument.name} 原先的研究情境出現差異。`,
    interpretation: "這項變化需要回到原始論點確認影響範圍，不直接形成買賣結論。",
    source: { publisher: "研究資料整理", title: `${target.instrument.name} 追蹤情境` },
    dataAsOf: "2026-08-08",
    affectedAssumption: target.observation,
    goalImpact: "確認這項標的在整體規劃中的角色是否仍然成立。",
  };

  return {
    dataStatus: "非即時資訊",
    events: [
      {
        id: "related-event-margin-outlook",
        title: mainEvent.title,
        happened: mainEvent.happened,
        interpretation: mainEvent.interpretation,
        impact: "論點影響",
        severity: target.attentionLevel === "重要" ? "重要" : "注意",
        source: mainEvent.source,
        dataAsOf: mainEvent.dataAsOf,
        dataStatus: "非即時資訊",
        affectedInstrument: { symbol: target.instrument.symbol, name: target.instrument.name },
        affectedAssumption: mainEvent.affectedAssumption,
        goalImpact: mainEvent.goalImpact,
      },
      {
        id: "related-event-observation",
        title: `持續觀察：${target.observation}`,
        happened: "目前尚未確認條件已成立，系統會保留這項觀察並持續比對後續資料。",
        interpretation: "這是使用者設定的重新檢視條件，不是市場預測或投資指令。",
        impact: "重要觀察",
        severity: "資訊",
        source: { publisher: "心跳追蹤", title: "使用者設定的觀察條件" },
        dataAsOf: "2026-08-08",
        dataStatus: "非即時資訊",
        affectedInstrument: { symbol: target.instrument.symbol, name: target.instrument.name },
        affectedAssumption: target.observation,
        goalImpact: "條件成立時，回到原始論點與個人規劃重新檢視。",
      },
    ],
  };
}
