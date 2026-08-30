import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";

type SectorPoint = {
  id: string;
  name: string;
  change: number;
  volumeChange: number;
  size: number;
  color: string;
  note: string;
};

const sectorSeeds: SectorPoint[] = [
  { id: "ai", name: "AI / 半導體設備", change: 8.6, volumeChange: 18.2, size: 22, color: "#2f7d6d", note: "資金流入" },
  { id: "fin", name: "金融", change: 2.1, volumeChange: 9.4, size: 16, color: "#77b9ac", note: "穩定上移" },
  { id: "auto", name: "自動化 / 工業電腦", change: 6.3, volumeChange: -3.8, size: 18, color: "#e0a040", note: "價格走強" },
  { id: "steel", name: "鋼鐵 / 原物料", change: -1.9, volumeChange: 11.5, size: 14, color: "#3d5d96", note: "量增價弱" },
  { id: "retail", name: "消費 / 零售", change: -3.6, volumeChange: -7.2, size: 13, color: "#9ca3af", note: "資金撤出" },
  { id: "green", name: "綠能 / 電力", change: 4.5, volumeChange: 4.1, size: 15, color: "#4f8a56", note: "均衡轉強" },
  { id: "land", name: "營建 / 不動產", change: -0.8, volumeChange: -1.8, size: 12, color: "#8c6d62", note: "觀望整理" },
  { id: "telecom", name: "通訊 / 網通", change: 1.2, volumeChange: -5.5, size: 12, color: "#6a7ea8", note: "價穩量縮" },
];

const axisMin = -12;
const axisMax = 12;

const scenarioConfigs = [
  {
    label: "資金追價升溫",
    deltas: [
      [1.4, 2.0],
      [0.6, 1.3],
      [1.8, -1.2],
      [-0.7, 1.6],
      [-1.1, -0.8],
      [1.2, 0.9],
      [-0.4, -0.9],
      [0.5, -1.8],
    ] as Array<[number, number]>,
  },
  {
    label: "資金偏向防禦",
    deltas: [
      [-1.3, -0.8],
      [0.4, 0.5],
      [-0.7, 1.1],
      [0.3, 0.8],
      [0.2, 0.4],
      [-0.5, -0.3],
      [0.1, 0.2],
      [-0.2, 0.9],
    ] as Array<[number, number]>,
  },
  {
    label: "資金換手整理",
    deltas: [
      [0.2, -1.2],
      [-0.8, 1.4],
      [0.9, 0.4],
      [-1.6, 0.9],
      [0.6, -0.7],
      [-0.3, 0.6],
      [1.1, -1.1],
      [-0.5, 0.5],
    ] as Array<[number, number]>,
  },
  {
    label: "資金分散輪動",
    deltas: [
      [0.9, 0.3],
      [-0.6, -0.4],
      [1.2, 1.5],
      [-1.0, 1.0],
      [-0.4, -1.0],
      [0.8, 1.1],
      [-0.9, -0.6],
      [0.7, -1.3],
    ] as Array<[number, number]>,
  },
];

function toPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function toX(change: number) {
  return 10 + ((change - axisMin) / (axisMax - axisMin)) * 80;
}

function toY(volumeChange: number) {
  return 10 + (1 - ((volumeChange - axisMin) / (axisMax - axisMin))) * 80;
}

export function RotationPage() {
  const [refreshCount, setRefreshCount] = useState(0);
  const scenario = scenarioConfigs[refreshCount % scenarioConfigs.length];
  const sectors = useMemo(() => {
    return sectorSeeds.map((seed, index) => {
      const [deltaChange, deltaVolume] = scenario.deltas[index];
      const refreshBias = ((refreshCount + index) % 3) - 1;
      return {
        ...seed,
        change: Number((seed.change + deltaChange + refreshBias * 0.4).toFixed(1)),
        volumeChange: Number((seed.volumeChange + deltaVolume + refreshBias * 0.7).toFixed(1)),
        size: Math.max(11, Math.min(25, seed.size + ((refreshCount + index) % 4) - 1)),
        note: [
          "資金流入",
          "穩定上移",
          "價格走強",
          "量增價弱",
          "資金撤出",
          "均衡轉強",
          "觀望整理",
          "價穩量縮",
        ][(refreshCount + index) % 8],
      };
    });
  }, [refreshCount, scenario]);
  const rotatedSectors = useMemo(() => {
    const offset = (refreshCount * 2) % sectors.length;
    return [...sectors.slice(offset), ...sectors.slice(0, offset)];
  }, [refreshCount, sectors]);
  const refreshLabel = refreshCount === 0 ? "尚未更新" : `已更新 ${refreshCount} 次`;
  const topRight = sectors.filter((item) => item.change >= 0 && item.volumeChange >= 0);
  const topLeft = sectors.filter((item) => item.change < 0 && item.volumeChange >= 0);
  const bottomRight = sectors.filter((item) => item.change >= 0 && item.volumeChange < 0);
  const bottomLeft = sectors.filter((item) => item.change < 0 && item.volumeChange < 0);
  const refreshedAt = new Date(Date.now() + refreshCount * 60_000).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" });

  return (
    <section>
      <PageHeader
        eyebrow="台股板塊輪動"
        title="看見資金正在往哪個象限移動"
        description="X 軸代表板塊漲跌幅，Y 軸代表成交量變化率；越靠右代表價格越強，越靠上代表量能越活躍。"
        action={<Button variant="secondary" onClick={() => setRefreshCount((value) => value + 1)}>更新板塊資料</Button>}
      />

      <div className="rotation-layout">
        <article className="card rotation-hero">
          <div className="rotation-hero-copy">
            <span className="card-label">四象限解讀</span>
            <h2>一眼看出資金流向與市場熱度</h2>
            <p>這張圖不是報酬預測，而是幫你快速分辨：哪些板塊同時「價強量增」，哪些是「量增價弱」或「價弱量縮」。</p>
            <strong className="rotation-scenario">目前市場情境：{scenario.label}</strong>
            <span className="rotation-status-pill">{refreshLabel}</span>
            <small className="rotation-refresh-note">目前資料更新時間：{refreshedAt}</small>
          </div>
          <div className="rotation-legend">
            <div><i className="legend-dot positive" />價強量增</div>
            <div><i className="legend-dot caution" />價弱量增</div>
            <div><i className="legend-dot growth" />價強量縮</div>
            <div><i className="legend-dot neutral" />價弱量縮</div>
          </div>
        </article>

        <article className="card scatter-card">
          <div className="scatter-head">
            <div>
              <span className="card-label">Scatter Plot</span>
              <h3>板塊輪動散佈圖</h3>
            </div>
            <div className="scatter-axis-note">
              <span>X：板塊漲跌幅</span>
              <span>Y：成交量變化率</span>
            </div>
          </div>

          <div className="scatter-wrap">
            <div className="scatter-quadrant q1">右上：價強量增</div>
            <div className="scatter-quadrant q2">左上：量增價弱</div>
            <div className="scatter-quadrant q3">左下：價弱量縮</div>
            <div className="scatter-quadrant q4">右下：價強量縮</div>

            <svg viewBox="0 0 100 100" className="scatter-svg" aria-hidden="true">
              <line x1="50" y1="0" x2="50" y2="100" />
              <line x1="0" y1="50" x2="100" y2="50" />
            </svg>
            {rotatedSectors.map((sector) => {
              const x = toX(sector.change);
              const y = toY(sector.volumeChange);
              return (
                <div key={sector.id} className="scatter-point" style={{ left: `${x}%`, top: `${y}%` }}>
                  <span className="scatter-bubble" style={{ width: `${sector.size * 2.1}px`, height: `${sector.size * 2.1}px`, background: sector.color }} />
                  <strong>{sector.name}</strong>
                  <small className="scatter-change">{toPercent(sector.change)} / {toPercent(sector.volumeChange)}</small>
                </div>
              );
            })}
          </div>
        </article>

        <div className="rotation-panels">
          <article className="card rotation-panel positive">
            <h3>右上：價強量增</h3>
            <p>通常代表資金正在積極追價，熱度與延續性都較高。</p>
            <strong>{topRight.map((item) => item.name).join("、")}</strong>
          </article>
          <article className="card rotation-panel caution">
            <h3>左上：量增價弱</h3>
            <p>量能提高但價格尚未同步轉強，常見於換手或整理初期。</p>
            <strong>{topLeft.map((item) => item.name).join("、")}</strong>
          </article>
          <article className="card rotation-panel growth">
            <h3>右下：價強量縮</h3>
            <p>價格仍在走強，但量能開始收斂，適合留意延續性。</p>
            <strong>{bottomRight.map((item) => item.name).join("、")}</strong>
          </article>
          <article className="card rotation-panel neutral">
            <h3>左下：價弱量縮</h3>
            <p>市場關注度較低，通常先視為觀望區，不急著追。</p>
            <strong>{bottomLeft.map((item) => item.name).join("、")}</strong>
          </article>
        </div>
      </div>

      <article className="card rotation-table">
        <div className="card-head">
          <div>
            <span className="card-label">板塊清單</span>
            <h3>每個板塊的相對位置</h3>
          </div>
          <small className="rotation-refresh-note">清單順序也會跟著更新，方便檢視資料變動。</small>
        </div>
        <div className="rotation-list">
          {rotatedSectors.map((sector) => (
            <div key={sector.id} className="rotation-row">
              <div>
                <strong>{sector.name}</strong>
                <small>{sector.note}</small>
              </div>
              <span>{toPercent(sector.change)}</span>
              <span>{toPercent(sector.volumeChange)}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
