export const routes = [
  { id: "welcome", label: "產品介紹", story: "01" },
  { id: "home", label: "首頁／總覽", story: "Dashboard" },
  { id: "onboarding", label: "建立目標", story: "02–03" },
  { id: "profile", label: "投資輪廓", story: "04–05" },
  { id: "plan", label: "我的規劃", story: "06" },
  { id: "explore", label: "投資探索", story: "07–08" },
  { id: "instrument", label: "標的分析", story: "09" },
  { id: "decision", label: "決策驗證", story: "11–12" },
  { id: "thesis", label: "我的論點", story: "13" },
  { id: "tracking", label: "心跳追蹤", story: "14" },
  { id: "change", label: "重要變化", story: "15–17" },
] as const;

export type RouteId = (typeof routes)[number]["id"];

export const routeMetadata = Object.fromEntries(routes.map((route) => [route.id, route])) as Record<RouteId, (typeof routes)[number]>;

export const secondaryRouteBackNavigation: Partial<Record<RouteId, { label: string; fallback: RouteId }>> = {
  instrument: { label: "返回候選研究標的", fallback: "explore" },
  decision: { label: "返回標的分析", fallback: "instrument" },
  change: { label: "返回心跳追蹤", fallback: "tracking" },
};

export const primaryNavigation: Array<{ id: RouteId; label: string; icon: string }> = [
  { id: "home", label: "首頁", icon: "⌂" },
  { id: "plan", label: "規劃", icon: "◎" },
  { id: "explore", label: "探索", icon: "◇" },
  { id: "thesis", label: "論點", icon: "▤" },
  { id: "tracking", label: "追蹤", icon: "⌁" },
];
