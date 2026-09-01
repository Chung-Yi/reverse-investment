import type { TrackingTarget } from "@shared/domain/tracking";
import type {
  TrackingCondition,
  TrackingConditionDefinition,
  TrackingConditionKind,
} from "@shared/domain/trackingCondition";

const conditionCopy: Record<TrackingConditionKind, Pick<TrackingConditionDefinition, "label" | "description">> = {
  price: { label: "價格門檻", description: "價格到達你設定的上限或下限時提醒。" },
  priceChange: { label: "期間漲跌", description: "單日或一週漲跌幅超過門檻時提醒。" },
  keyMetric: { label: "關鍵指標", description: "追蹤會影響原始假設的標的核心數據。" },
  importantEvent: { label: "重要事件", description: "公司或基金的重要資訊公布時提醒。" },
  portfolio: { label: "個人持倉", description: "持倉占比或未實現損益跨過門檻時提醒。" },
};

const isEtf = (target: TrackingTarget) => target.instrument.category.includes("ETF");

interface TrackingInstrumentProfile {
  referencePrice: number;
  keyMetrics: TrackingConditionDefinition["options"];
  importantEvents: TrackingConditionDefinition["options"];
  portfolioWeightThreshold: number;
}

const stockEvents: TrackingConditionDefinition["options"] = [
  { id: "financial-report", label: "財務報告公告", supportedComparators: ["eventOccurs"] },
  { id: "investor-conference", label: "法人說明會", supportedComparators: ["eventOccurs"] },
  { id: "material-information", label: "公司重大訊息", supportedComparators: ["eventOccurs"] },
  { id: "dividend-policy", label: "股利政策公告", supportedComparators: ["eventOccurs"] },
];

const etfEvents: TrackingConditionDefinition["options"] = [
  { id: "distribution", label: "收益分配公告", supportedComparators: ["eventOccurs"] },
  { id: "index-adjustment", label: "追蹤指數或成分股調整", supportedComparators: ["eventOccurs"] },
  { id: "fund-material-event", label: "基金重大事項", supportedComparators: ["eventOccurs"] },
];

const trackingInstrumentProfiles: Record<string, TrackingInstrumentProfile> = {
  "twse-2330": {
    referencePrice: 1040,
    portfolioWeightThreshold: 25,
    keyMetrics: [
      { id: "monthly-revenue-yoy", label: "月營收年增率", unit: "%", defaultThreshold: 10, supportedComparators: ["below"] },
      { id: "gross-margin", label: "毛利率", unit: "%", defaultThreshold: 60, supportedComparators: ["below"] },
      { id: "eps", label: "每股盈餘", unit: "元", defaultThreshold: 15, supportedComparators: ["below"] },
    ],
    importantEvents: stockEvents,
  },
  "twse-0050": {
    referencePrice: 188,
    portfolioWeightThreshold: 40,
    keyMetrics: [
      { id: "premium-discount", label: "折溢價幅度", unit: "%", defaultThreshold: 1, supportedComparators: ["changeAtLeast"] },
      { id: "tracking-difference", label: "追蹤差異", unit: "%", defaultThreshold: 1, supportedComparators: ["above"] },
      { id: "top-holdings-weight", label: "前十大成分股集中度", unit: "%", defaultThreshold: 65, supportedComparators: ["above"] },
    ],
    importantEvents: etfEvents,
  },
  "twse-2881": {
    referencePrice: 92,
    portfolioWeightThreshold: 25,
    keyMetrics: [
      { id: "capital-adequacy", label: "資本適足率", unit: "%", defaultThreshold: 120, supportedComparators: ["below"] },
      { id: "eps", label: "每股盈餘", unit: "元", defaultThreshold: 5, supportedComparators: ["below"] },
      { id: "dividend-payout", label: "股利發放率", unit: "%", defaultThreshold: 40, supportedComparators: ["below"] },
    ],
    importantEvents: stockEvents,
  },
};

function fallbackProfile(target: TrackingTarget): TrackingInstrumentProfile {
  const etf = isEtf(target);
  return {
    referencePrice: 100,
    portfolioWeightThreshold: etf ? 40 : 25,
    keyMetrics: etf ? [
      { id: "premium-discount", label: "折溢價幅度", unit: "%", defaultThreshold: 1, supportedComparators: ["changeAtLeast"] },
      { id: "tracking-difference", label: "追蹤差異", unit: "%", defaultThreshold: 1, supportedComparators: ["above"] },
    ] : [
      { id: "monthly-revenue-yoy", label: "月營收年增率", unit: "%", defaultThreshold: 10, supportedComparators: ["below"] },
      { id: "eps", label: "每股盈餘", unit: "元", defaultThreshold: 5, supportedComparators: ["below"] },
    ],
    importantEvents: etf ? etfEvents : stockEvents,
  };
}

function marketOptions(target: TrackingTarget): TrackingConditionDefinition[] {
  const profile = trackingInstrumentProfiles[target.instrument.id] ?? fallbackProfile(target);
  return [
    {
      kind: "price",
      ...conditionCopy.price,
      options: [{ id: "market-price", label: "市場價格", unit: "NT$", defaultThreshold: Math.round(profile.referencePrice * 0.9), supportedComparators: ["below", "above"] }],
    },
    {
      kind: "priceChange",
      ...conditionCopy.priceChange,
      options: [
        { id: "daily-change", label: "單日漲跌幅", unit: "%", defaultThreshold: 5, supportedComparators: ["changeAtLeast"] },
        { id: "weekly-change", label: "一週漲跌幅", unit: "%", defaultThreshold: 10, supportedComparators: ["changeAtLeast"] },
      ],
    },
    {
      kind: "keyMetric",
      ...conditionCopy.keyMetric,
      options: profile.keyMetrics,
    },
    {
      kind: "importantEvent",
      ...conditionCopy.importantEvent,
      options: profile.importantEvents,
    },
    {
      kind: "portfolio",
      ...conditionCopy.portfolio,
      options: [
        { id: "portfolio-weight", label: "資產占比", unit: "%", defaultThreshold: profile.portfolioWeightThreshold, supportedComparators: ["above"] },
        { id: "unrealized-loss", label: "未實現損失", unit: "%", defaultThreshold: 15, supportedComparators: ["above"] },
      ],
    },
  ];
}

export function buildTrackingConditionDefinitions(target: TrackingTarget): TrackingConditionDefinition[] {
  return marketOptions(target);
}

const seededConditions: Record<string, Omit<TrackingCondition, "trackingId">[]> = {
  "tracking-twse-2330": [
    { id: "condition-2330-price", kind: "price", kindLabel: "價格門檻", optionId: "market-price", optionLabel: "市場價格", comparator: "below", threshold: 900, unit: "NT$", summary: "市場價格低於 NT$ 900", enabled: true, updatedAt: "2026-08-30" },
    { id: "condition-2330-event", kind: "importantEvent", kindLabel: "重要事件", optionId: "investor-conference", optionLabel: "法人說明會", comparator: "eventOccurs", summary: "法人說明會資料公布", enabled: true, updatedAt: "2026-08-30" },
  ],
  "tracking-twse-0050": [
    { id: "condition-0050-concentration", kind: "keyMetric", kindLabel: "關鍵指標", optionId: "top-holdings-weight", optionLabel: "前十大成分股集中度", comparator: "above", threshold: 65, unit: "%", summary: "前十大成分股集中度高於 65%", enabled: true, updatedAt: "2026-08-28" },
  ],
  "tracking-twse-2881": [
    { id: "condition-2881-capital", kind: "keyMetric", kindLabel: "關鍵指標", optionId: "capital-adequacy", optionLabel: "資本適足率", comparator: "below", threshold: 120, unit: "%", summary: "資本適足率低於 120%", enabled: true, updatedAt: "2026-08-27" },
    { id: "condition-2881-dividend", kind: "importantEvent", kindLabel: "重要事件", optionId: "dividend-policy", optionLabel: "股利政策公告", comparator: "eventOccurs", summary: "股利政策公告時提醒", enabled: true, updatedAt: "2026-08-27" },
  ],
};

export function buildSeededTrackingConditions(trackingId: string): TrackingCondition[] {
  return (seededConditions[trackingId] ?? []).map((condition) => ({ ...condition, trackingId }));
}
