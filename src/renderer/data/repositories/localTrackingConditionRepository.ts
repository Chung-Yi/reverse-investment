import type { TrackingConditionComparator, TrackingCondition } from "@shared/domain/trackingCondition";
import { buildSeededTrackingConditions, buildTrackingConditionDefinitions } from "../fixtures/trackingConditionCatalog";
import type { TrackingConditionRepository } from "./TrackingConditionRepository";

const storageKey = "reverse-investment.tracking-conditions.v1";

function readStored(): Record<string, TrackingCondition[]> {
  try {
    const value = window.localStorage.getItem(storageKey);
    return value ? JSON.parse(value) as Record<string, TrackingCondition[]> : {};
  } catch {
    return {};
  }
}

function writeStored(value: Record<string, TrackingCondition[]>) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Device-local persistence is best effort; repository behavior still works in memory for this session.
  }
}

const comparatorLabels: Record<TrackingConditionComparator, string> = {
  below: "低於",
  above: "高於",
  changeAtLeast: "漲跌幅達到",
  eventOccurs: "資料公布",
};

export const localTrackingConditionRepository: TrackingConditionRepository = {
  async getSetup(target) {
    const stored = readStored();
    const activeConditions = stored[target.trackingId] ?? buildSeededTrackingConditions(target.trackingId);
    return structuredClone({ target, definitions: buildTrackingConditionDefinitions(target), activeConditions });
  },

  async save(target, input) {
    const definitions = buildTrackingConditionDefinitions(target);
    const definition = definitions.find((item) => item.kind === input.kind);
    const option = definition?.options.find((item) => item.id === input.optionId);
    if (!definition || !option) throw new Error("找不到這個標的可用的追蹤條件。");
    const threshold = input.comparator === "eventOccurs" ? undefined : input.threshold;
    const summary = input.comparator === "eventOccurs"
      ? `${option.label}時提醒`
      : `${option.label}${comparatorLabels[input.comparator]} ${option.unit === "NT$" ? "NT$ " : ""}${threshold ?? ""}${option.unit === "NT$" ? "" : option.unit ?? ""}`;
    const condition: TrackingCondition = {
      id: `condition-${target.instrument.symbol}-${input.kind}-${input.optionId}`,
      trackingId: target.trackingId,
      kind: input.kind,
      kindLabel: definition.label,
      optionId: option.id,
      optionLabel: option.label,
      comparator: input.comparator,
      threshold,
      unit: option.unit,
      summary,
      enabled: true,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    const stored = readStored();
    const current = stored[target.trackingId] ?? buildSeededTrackingConditions(target.trackingId);
    stored[target.trackingId] = [...current.filter((item) => item.id !== condition.id), condition];
    writeStored(stored);
    return structuredClone(condition);
  },

  async remove(trackingId, conditionId) {
    const stored = readStored();
    const current = stored[trackingId] ?? buildSeededTrackingConditions(trackingId);
    stored[trackingId] = current.filter((item) => item.id !== conditionId);
    writeStored(stored);
  },
};
