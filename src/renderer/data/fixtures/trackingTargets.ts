import type { TrackingTarget } from "@shared/domain/tracking";
import type { TrackingTargetRequest } from "../repositories/TrackingRepository";

export function buildTrackingTargets({
  primaryInstrument,
  primaryThesis,
  primaryObservation,
}: TrackingTargetRequest): TrackingTarget[] {
  return [
    {
      trackingId: `tracking-${primaryInstrument.id}`,
      thesisId: primaryThesis.id,
      instrument: {
        id: primaryInstrument.id,
        symbol: primaryInstrument.symbol,
        name: primaryInstrument.name,
        category: primaryInstrument.category,
      },
      thesisReason: primaryThesis.reason,
      validityScore: primaryThesis.validityScore,
      suitabilityScore: primaryThesis.suitabilityScore,
      observation: primaryObservation.trim() || "尚未建立重要觀察條件",
      attentionLevel: "注意",
      updatedAt: primaryThesis.updatedAt,
    },
    {
      trackingId: "tracking-twse-0050",
      thesisId: "thesis-twse-0050",
      instrument: { id: "twse-0050", symbol: "0050", name: "元大台灣50", category: "ETF・大型權值" },
      thesisReason: "以大型權值股作為長期配置基礎，持續確認集中度、費用與市場代表性是否符合原始規劃。",
      validityScore: 82,
      suitabilityScore: 86,
      observation: "若前十大成分股集中度明顯上升，重新檢視分散效果。",
      attentionLevel: "注意",
      updatedAt: "2026-08-08",
    },
    {
      trackingId: "tracking-twse-2881",
      thesisId: "thesis-twse-2881",
      instrument: { id: "twse-2881", symbol: "2881", name: "富邦金", category: "個股・金融" },
      thesisReason: "追蹤金融業獲利品質、資本適足與股利穩定性，確認是否仍符合長期投資角色。",
      validityScore: 74,
      suitabilityScore: 77,
      observation: "若資本適足率或股利政策明顯改變，重新檢視長期配置理由。",
      attentionLevel: "穩定",
      updatedAt: "2026-08-08",
    },
  ];
}
