import type { RelatedEvent, RelatedEventFeed } from "@shared/domain/relatedEvent";
import type { RelatedEventFeedRequest } from "../repositories/RelatedEventRepository";
import { importantChangeSnapshot } from "./demoInvestment";

export function buildRelatedEventFeed({ target }: RelatedEventFeedRequest): RelatedEventFeed {
  const eventsByInstrument: Record<string, RelatedEvent[]> = {
    "twse-2330": [
      {
        id: "related-event-2330-margin-outlook",
        eventType: "官方重要事件",
        status: "已觸發",
        title: importantChangeSnapshot.title,
        happened: importantChangeSnapshot.happened,
        interpretation: "獲利率展望可能正常化，但目前資訊尚不足以否定長期需求假設。",
        confirmedFacts: [
          "2026 年第二季毛利率為 67.7%。",
          "公司提供的第三季毛利率展望為 65% 至 67%。",
        ],
        verificationItems: [
          "確認毛利率變化主要來自產品組合、匯率或成本因素。",
          "等待下一期實際結果，避免只用單次展望改變長期判斷。",
        ],
        impact: "論點影響",
        severity: "注意",
        source: importantChangeSnapshot.source,
        dataAsOf: importantChangeSnapshot.dataAsOf,
        dataStatus: "非即時資訊",
        trigger: {
          conditionId: "condition-2330-event",
          conditionKind: "importantEvent",
          optionId: "investor-conference",
          comparator: "eventOccurs",
          label: "法人說明會",
          detail: "法人說明會資料公布",
          observed: "2026 年第二季資料已公布",
          difference: "符合事件觸發條件",
        },
        affectedInstrument: { symbol: target.instrument.symbol, name: target.instrument.name },
        affectedAssumption: importantChangeSnapshot.assumption,
        goalImpact: importantChangeSnapshot.goalImpact,
      },
    ],
    "twse-0050": [
      {
        id: "related-event-0050-concentration",
        eventType: "追蹤條件觸發",
        status: "已觸發",
        title: "前十大成分股集中度達到追蹤門檻",
        happened: "最新彙整的前十大成分股占比為 67.8%，高於目前設定的 65% 提醒門檻。",
        interpretation: "集中度提高不直接代表配置失效，但需要重新確認分散效果與大型權值股曝險是否仍符合原始規劃。",
        confirmedFacts: [
          "目前彙整值為 67.8%。",
          "使用者設定的提醒門檻為高於 65%。",
        ],
        verificationItems: [
          "確認持股資料的發布日期與計算口徑是否一致。",
          "檢查集中度提高是短期價格變化，還是成分股權重調整造成。",
        ],
        impact: "風險變化",
        severity: "注意",
        source: { publisher: "基金公開資訊彙整", title: "元大台灣50持股集中度資料" },
        dataAsOf: "2026-08-08",
        dataStatus: "非即時資訊",
        trigger: {
          conditionId: "condition-0050-concentration",
          conditionKind: "keyMetric",
          optionId: "top-holdings-weight",
          comparator: "above",
          threshold: 65,
          unit: "%",
          label: "前十大成分股集中度",
          detail: "高於 65%",
          observed: "67.8%",
          difference: "高於門檻 2.8 個百分點",
        },
        affectedInstrument: { symbol: target.instrument.symbol, name: target.instrument.name },
        affectedAssumption: "大型權值股配置仍能提供符合預期的分散效果",
        goalImpact: "需要確認核心配置的集中度是否仍符合長期規劃與可承受波動範圍。",
      },
    ],
    "twse-2881": [],
  };

  return {
    dataStatus: "非即時資訊",
    events: eventsByInstrument[target.instrument.id] ?? [],
  };
}
