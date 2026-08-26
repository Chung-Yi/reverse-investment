import type { PortfolioPosition, PortfolioPositionInput, SimulatedPortfolio } from "@shared/domain/investment";

export interface PortfolioRepository {
  getPortfolio(): Promise<SimulatedPortfolio>;
  savePosition(input: PortfolioPositionInput): Promise<PortfolioPosition>;
  removePosition(positionId: string): Promise<void>;
  removePositions(positionIds: string[]): Promise<void>;
}
