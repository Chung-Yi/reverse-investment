import type { CandidateInstrument, ResearchCandidate } from "@shared/domain/investment";
import type { NewsFeed, NewsInstrumentReference } from "@shared/domain/news";
import type { NewsFeedRequest } from "../repositories/NewsRepository";

type NewsTarget = Pick<ResearchCandidate, "symbol" | "name" | "category"> & {
  directionTitle?: string;
};

function selectCoveredTargets(
  primaryInstrument: CandidateInstrument,
  researchCandidates: ResearchCandidate[],
): NewsTarget[] {
  const primaryTarget = researchCandidates.find((item) => item.symbol === primaryInstrument.symbol)
    ?? primaryInstrument;

  return [
    primaryTarget,
    ...researchCandidates.filter((item) => item.symbol !== primaryTarget.symbol),
  ].slice(0, 3);
}

export function buildResearchNewsFeed({
  primaryInstrument,
  researchCandidates,
  thesisObservation,
}: NewsFeedRequest): NewsFeed {
  const targets = selectCoveredTargets(primaryInstrument, researchCandidates);
  const primaryTarget = targets[0] ?? primaryInstrument;
  const secondaryTarget = targets[1] ?? primaryTarget;
  const tertiaryTarget = targets[2] ?? secondaryTarget;
  const observation = thesisObservation.trim() || "尚未建立重要觀察條件";
  const instruments: NewsInstrumentReference[] = targets.map(({ symbol, name }) => ({ symbol, name }));

  return {
    instruments,
    dataStatus: "非即時資訊",
    events: [
      {
        id: "news-1",
        title: `${primaryTarget.name} 最新財報維持成長，但毛利率變化仍需觀察`,
        source: primaryInstrument.sources[0]?.publisher ?? primaryInstrument.category,
        updateLabel: `${primaryInstrument.dataAsOf} 更新`,
        summary: "這項變化可能影響目前論點的重要假設，先確認影響範圍，再決定是否需要重新檢視。",
        impact: "論點影響",
        affectedContext: `${primaryTarget.symbol} ${primaryTarget.name}`,
      },
      {
        id: "news-2",
        title: `市場波動變化下，${secondaryTarget.name} 的配置角色需要重新確認`,
        source: "市場情境資料",
        updateLabel: "非即時資訊",
        summary: `這項訊號用來檢查 ${secondaryTarget.name} 是否仍符合原本的研究用途，不代表即時市場判斷。`,
        impact: "風險變化",
        affectedContext: `${secondaryTarget.symbol} ${secondaryTarget.name}`,
      },
      {
        id: "news-3",
        title: `${tertiaryTarget.directionTitle ?? tertiaryTarget.category} 出現值得持續研究的產業變化`,
        source: "產業情境資料",
        updateLabel: "非即時資訊",
        summary: `這項訊號與 ${tertiaryTarget.name} 的研究方向有關，可作為補充產業脈絡的起點。`,
        impact: "產業脈絡",
        affectedContext: `${tertiaryTarget.symbol} ${tertiaryTarget.name}`,
      },
      {
        id: "news-4",
        title: `若 ${observation}，請回來重新檢視目前判斷`,
        source: "心跳追蹤",
        updateLabel: "持續監控",
        summary: "這項內容來自使用者設定的追蹤條件，用來提示何時需要重新檢視，而不是外部新聞結論。",
        impact: "重要觀察",
        affectedContext: observation,
      },
      {
        id: "news-5",
        title: "利率與匯率變化可能影響金融與大型權值板塊",
        source: "總體市場情境",
        updateLabel: "非即時資訊",
        summary: "這項背景資訊不取代標的分析，只用來提醒整體市場風險偏好也可能影響研究判斷。",
        impact: "市場總經",
        affectedContext: "台股市場背景",
      },
    ],
  };
}
