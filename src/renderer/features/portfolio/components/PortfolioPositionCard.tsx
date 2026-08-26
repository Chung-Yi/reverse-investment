import type { PortfolioPosition } from "@shared/domain/investment";
import { Button } from "../../../components/ui/Button";
import { formatTwd } from "../../../utils/formatTwd";
import { SelectionCheckbox } from "./SelectionCheckbox";
import styles from "../PortfolioPage.module.css";

const decimal = new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 2 });

interface PortfolioPositionCardProps {
  position: PortfolioPosition;
  portfolioValue: number;
  selected: boolean;
  onToggleSelection: (positionId: string, selected: boolean) => void;
  onEdit: (position: PortfolioPosition) => void;
  onRemove: (position: PortfolioPosition) => void;
}

export function PortfolioPositionCard({ position, portfolioValue, selected, onToggleSelection, onEdit, onRemove }: PortfolioPositionCardProps) {
  const cost = position.quantity * position.averageCost;
  const marketValue = position.quantity * position.referencePrice;
  const gain = marketValue - cost;
  const gainRate = cost > 0 ? gain / cost * 100 : 0;
  const weight = portfolioValue > 0 ? marketValue / portfolioValue * 100 : 0;

  return (
    <article className={`card ${styles.positionCard} ${selected ? styles.positionSelected : ""}`}>
      <SelectionCheckbox
        className={styles.rowSelection}
        label={`選取 ${position.name}`}
        checked={selected}
        onChange={(checked) => onToggleSelection(position.positionId, checked)}
      />
      <div className={styles.positionIdentity}>
        <span className={styles.ticker}>{position.symbol}</span>
        <div>
          <span>{position.market}・{position.instrumentType}・{position.category}</span>
          <h3>{position.name}</h3>
          <small>{position.allocationRole}</small>
        </div>
      </div>
      <dl className={styles.positionMetrics}>
        <div><dt>持有數量</dt><dd>{decimal.format(position.quantity)}</dd></div>
        <div><dt>平均成本</dt><dd>{formatTwd(position.averageCost)}</dd></div>
        <div><dt>參考價格</dt><dd>{formatTwd(position.referencePrice)}</dd></div>
        <div><dt>估算市值</dt><dd>{formatTwd(marketValue)}</dd></div>
        <div><dt>未實現損益</dt><dd className={gain >= 0 ? styles.positive : styles.negative}>{gain >= 0 ? "+" : ""}{formatTwd(gain)}<small>{gainRate >= 0 ? "+" : ""}{gainRate.toFixed(1)}%</small></dd></div>
        <div><dt>資產占比</dt><dd>{weight.toFixed(1)}%</dd></div>
      </dl>
      <div className={styles.positionActions}>
        <Button variant="secondary" onClick={() => onEdit(position)}>編輯</Button>
        <button className={`${styles.iconButton} ${styles.dangerIconButton}`} type="button" onClick={() => onRemove(position)} aria-label={`移除 ${position.name}`} title="移除持倉">
          <span className={styles.trashIcon} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
