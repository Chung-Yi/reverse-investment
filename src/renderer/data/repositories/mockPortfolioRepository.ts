import type { PortfolioPosition, PortfolioPositionInput, SimulatedPortfolio } from "@shared/domain/investment";
import { demoInstrumentCatalog } from "../fixtures/instrumentCatalog";
import { demoSimulatedPortfolio } from "../fixtures/demoPortfolio";
import type { PortfolioRepository } from "./PortfolioRepository";

let portfolioState: SimulatedPortfolio = structuredClone(demoSimulatedPortfolio);
let positionSequence = 1;

function validateInput(input: PortfolioPositionInput) {
  if (!Number.isFinite(input.quantity) || input.quantity <= 0) throw new Error("invalid_quantity");
  if (!Number.isFinite(input.averageCost) || input.averageCost <= 0) throw new Error("invalid_average_cost");
  if (!Number.isFinite(input.referencePrice) || input.referencePrice <= 0) throw new Error("invalid_reference_price");
}

export const mockPortfolioRepository: PortfolioRepository = {
  async getPortfolio() {
    return structuredClone(portfolioState);
  },

  async savePosition(input) {
    validateInput(input);
    const instrument = demoInstrumentCatalog.find((item) => item.id === input.instrumentId);
    if (!instrument) throw new Error("instrument_not_found");
    const existing = input.positionId
      ? portfolioState.positions.find((position) => position.positionId === input.positionId)
      : undefined;
    if (!existing && portfolioState.positions.some((position) => position.instrumentId === input.instrumentId)) {
      throw new Error("position_already_exists");
    }

    const saved: PortfolioPosition = {
      ...instrument,
      positionId: existing?.positionId ?? `position-${instrument.id}-${positionSequence++}`,
      instrumentId: instrument.id,
      allocationRole: input.allocationRole,
      quantity: input.quantity,
      averageCost: input.averageCost,
      referencePrice: input.referencePrice,
    };
    portfolioState = {
      ...portfolioState,
      positions: existing
        ? portfolioState.positions.map((position) => position.positionId === existing.positionId ? saved : position)
        : [...portfolioState.positions, saved],
    };
    return structuredClone(saved);
  },

  async removePosition(positionId) {
    portfolioState = {
      ...portfolioState,
      positions: portfolioState.positions.filter((position) => position.positionId !== positionId),
    };
  },

  async removePositions(positionIds) {
    const selectedIds = new Set(positionIds);
    portfolioState = {
      ...portfolioState,
      positions: portfolioState.positions.filter((position) => !selectedIds.has(position.positionId)),
    };
  },
};
