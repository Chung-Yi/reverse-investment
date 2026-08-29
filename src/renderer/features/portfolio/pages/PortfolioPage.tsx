import { useEffect, useMemo, useState } from "react";
import type { PortfolioPosition } from "@shared/domain/investment";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";
import { demoInstrumentCatalog } from "../../../data/fixtures/instrumentCatalog";
import type { PortfolioRepository } from "../../../data/repositories/PortfolioRepository";
import type { InvestmentData } from "../../../hooks/useInvestmentData";
import { formatTwd } from "../../../utils/formatTwd";
import { PortfolioPositionCard } from "../components/PortfolioPositionCard";
import { PortfolioPositionDialog } from "../components/PortfolioPositionDialog";
import { SelectionCheckbox } from "../components/SelectionCheckbox";
import { usePortfolio } from "../hooks/usePortfolio";
import styles from "../PortfolioPage.module.css";

export function PortfolioPage({ data, repository }: { data: InvestmentData; repository: PortfolioRepository }) {
  const { portfolio, loading, error, clearError, savePosition, removePosition, removePositions } = usePortfolio(repository);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<PortfolioPosition | null>(null);
  const [selectedPositionIds, setSelectedPositionIds] = useState<string[]>([]);

  const totals = useMemo(() => {
    const positions = portfolio?.positions ?? [];
    const cost = positions.reduce((sum, position) => sum + position.quantity * position.averageCost, 0);
    const marketValue = positions.reduce((sum, position) => sum + position.quantity * position.referencePrice, 0);
    const longTerm = positions.filter((position) => position.allocationRole === "長期投資").reduce((sum, position) => sum + position.quantity * position.referencePrice, 0);
    const growth = positions.filter((position) => position.allocationRole === "成長投資").reduce((sum, position) => sum + position.quantity * position.referencePrice, 0);
    const cash = portfolio?.cashBalance ?? 0;
    return { cost, marketValue, longTerm, growth, cash, totalAssets: marketValue + cash, gain: marketValue - cost };
  }, [portfolio]);

  useEffect(() => {
    if (!portfolio) return;
    const availableIds = new Set(portfolio.positions.map((position) => position.positionId));
    setSelectedPositionIds((current) => current.filter((positionId) => availableIds.has(positionId)));
  }, [portfolio]);

  if (loading || !portfolio) return <div className="feedback-state"><span className="loader" /><h1>正在整理資產資料</h1></div>;

  const gainRate = totals.cost > 0 ? totals.gain / totals.cost * 100 : 0;
  const goalProgress = data.goal.targetAmount > 0 ? Math.min(totals.totalAssets / data.goal.targetAmount * 100, 100) : 0;
  const actualAllocations = [
    { label: "長期投資", value: totals.longTerm, planned: data.allocations.find((item) => item.label === "長期投資")?.percentage ?? 0, tone: styles.longTerm },
    { label: "成長投資", value: totals.growth, planned: data.allocations.find((item) => item.label === "成長投資")?.percentage ?? 0, tone: styles.growth },
    { label: "保留資金", value: totals.cash, planned: data.allocations.find((item) => item.label === "保留資金")?.percentage ?? 0, tone: styles.cash },
  ].map((item) => ({ ...item, actual: totals.totalAssets > 0 ? item.value / totals.totalAssets * 100 : 0 }));
  const positionsOverLimit = portfolio.positions.filter((position) => (
    totals.totalAssets > 0 && position.quantity * position.referencePrice / totals.totalAssets * 100 > data.planPolicy.singlePositionLimitPercentage
  ));

  const openAddDialog = () => {
    clearError();
    setEditingPosition(null);
    setDialogOpen(true);
  };
  const openEditDialog = (position: PortfolioPosition) => {
    clearError();
    setEditingPosition(position);
    setDialogOpen(true);
  };
  const confirmRemove = (position: PortfolioPosition) => {
    if (window.confirm(`確定要從模擬持倉移除「${position.name}」嗎？`)) void removePosition(position.positionId);
  };
  const toggleSelection = (positionId: string, selected: boolean) => {
    setSelectedPositionIds((current) => selected
      ? [...new Set([...current, positionId])]
      : current.filter((id) => id !== positionId));
  };
  const allSelected = portfolio.positions.length > 0 && selectedPositionIds.length === portfolio.positions.length;
  const partiallySelected = selectedPositionIds.length > 0 && !allSelected;
  const toggleAll = (selected: boolean) => {
    setSelectedPositionIds(selected ? portfolio.positions.map((position) => position.positionId) : []);
  };
  const confirmRemoveSelected = async () => {
    if (!window.confirm(`確定要移除已選取的 ${selectedPositionIds.length} 筆模擬持倉嗎？`)) return;
    if (await removePositions(selectedPositionIds)) setSelectedPositionIds([]);
  };

  return (
    <section>
      <PageHeader
        eyebrow="持倉與目標對照"
        title="我的資產"
        description="把目前持倉與原始規劃放在一起，確認資金是否仍朝目標前進。"
      />

      <div className={styles.simulationNotice}>
        <strong>模擬資產紀錄</strong>
        <span>尚未連結券商，不會送出真實交易；參考價格由使用者自行輸入。</span>
        <small>價格資料：{portfolio.priceAsOf}</small>
      </div>
      {error && <div className={styles.errorMessage} role="alert">{error}<button type="button" onClick={clearError}>關閉</button></div>}

      <div className={styles.summaryGrid}>
        <article className={`card ${styles.primarySummary}`}>
          <span>總資產</span>
          <strong className={styles.totalAssetValue}>{formatTwd(totals.totalAssets)}</strong>
          <small>持倉市值加上保留資金</small>
        </article>
        <article className="card"><span>持倉市值</span><strong>{formatTwd(totals.marketValue)}</strong><small>投入成本 {formatTwd(totals.cost)}</small></article>
        <article className="card"><span>未實現損益</span><strong className={totals.gain >= 0 ? styles.positive : styles.negative}>{totals.gain >= 0 ? "+" : ""}{formatTwd(totals.gain)}</strong><small>{gainRate >= 0 ? "+" : ""}{gainRate.toFixed(1)}%</small></article>
        <article className="card"><span>目標進度</span><strong>{goalProgress.toFixed(1)}%</strong><small>目標 {formatTwd(data.goal.targetAmount)}</small></article>
      </div>

      <section className={`card ${styles.allocationPanel}`} aria-labelledby="allocation-title">
        <header>
          <div><span className="card-label">規劃對照</span><h2 id="allocation-title">目前配置是否符合原始規劃？</h2></div>
          <span className={positionsOverLimit.length > 0 ? "status attention" : "status stable"}>{positionsOverLimit.length > 0 ? "需要留意" : "接近規劃"}</span>
        </header>
        <div className={styles.allocationBar} aria-label="目前資產配置比例">
          {actualAllocations.map((item) => <i key={item.label} className={item.tone} style={{ width: `${item.actual}%` }} title={`${item.label} ${item.actual.toFixed(1)}%`} />)}
        </div>
        <div className={styles.allocationRows}>
          {actualAllocations.map((item) => (
            <div key={item.label}>
              <span className={`${styles.legend} ${item.tone}`} />
              <strong>{item.label}</strong>
              <span>目前 {item.actual.toFixed(1)}%</span>
              <small>規劃 {item.planned}%</small>
            </div>
          ))}
        </div>
        {positionsOverLimit.length > 0 && (
          <p className={styles.allocationAlert}>
            {positionsOverLimit.map((position) => position.name).join("、")} 的資產占比超過單一部位 {data.planPolicy.singlePositionLimitPercentage}% 的規劃上限，建議回到研究論點確認集中風險。
          </p>
        )}
      </section>

      <div className={styles.positionHeading}>
        <span className="card-label">模擬持倉</span>
        <h2>目前持有 {portfolio.positions.length} 個標的</h2>
        <p className={styles.positionHint}>估算市值以手動輸入的參考價格計算</p>
      </div>
      <div className={`${styles.selectionToolbar} ${selectedPositionIds.length > 0 ? styles.selectionToolbarActive : ""}`}>
        {portfolio.positions.length > 0 && (
          <>
            <SelectionCheckbox
              label="選取全部模擬持倉"
              checked={allSelected}
              indeterminate={partiallySelected}
              onChange={toggleAll}
            />
            <span>{selectedPositionIds.length > 0 ? `已選取 ${selectedPositionIds.length} 筆` : "選取全部"}</span>
            {selectedPositionIds.length > 0 && (
              <button className={`${styles.iconButton} ${styles.dangerIconButton}`} type="button" onClick={() => void confirmRemoveSelected()} aria-label={`移除已選取的 ${selectedPositionIds.length} 筆持倉`} title="移除選取項目">
                <span className={styles.trashIcon} aria-hidden="true" />
              </button>
            )}
          </>
        )}
        <Button className={styles.positionPrimaryAction} onClick={openAddDialog}>＋ 新增模擬持倉</Button>
      </div>
      <div className={styles.positionList}>
        {portfolio.positions.map((position) => (
          <PortfolioPositionCard
            key={position.positionId}
            position={position}
            portfolioValue={totals.totalAssets}
            selected={selectedPositionIds.includes(position.positionId)}
            onToggleSelection={toggleSelection}
            onEdit={openEditDialog}
            onRemove={confirmRemove}
          />
        ))}
        {portfolio.positions.length === 0 && (
          <div className={`card ${styles.emptyState}`}><h3>還沒有模擬持倉</h3><p>加入第一個標的後，就能開始比較實際配置與原始規劃。</p></div>
        )}
      </div>

      <PortfolioPositionDialog
        open={dialogOpen}
        instruments={demoInstrumentCatalog}
        unavailableInstrumentIds={portfolio.positions.map((position) => position.instrumentId)}
        position={editingPosition}
        onSave={savePosition}
        onClose={() => setDialogOpen(false)}
      />
    </section>
  );
}
