// src/hooks/useVolsCalculations.ts
import { useState, useCallback, useMemo } from "react";
import type { CableNode } from "../types/vols";
import { calculateAccidentPosition } from "../utils/railwayUtils";

export type AccidentCalculationResult = {
  coords: [number, number];
  railwayKm: number;
  railwayPk: number;
};

export function useVolsCalculations(
  filteredNodes: CableNode[],
  selectedNode: CableNode | undefined,
) {
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [reflectometerValue, setReflectometerValue] = useState<number | "">("");
  const [accidentResult, setAccidentResult] =
    useState<AccidentCalculationResult | null>(null);

  const handleCalculate = useCallback(() => {
    if (!selectedNode || filteredNodes.length === 0) {
      return;
    }

    if (reflectometerValue === "" || !Number.isFinite(reflectometerValue)) {
      return;
    }

    const result = calculateAccidentPosition(
      filteredNodes,
      selectedNode,
      direction,
      reflectometerValue,
    );

    if (result) {
      setAccidentResult(result);
    } else {
      alert("Выход за пределы трассы ВОЛС этой секции!");
      setAccidentResult(null);
    }
  }, [selectedNode, filteredNodes, direction, reflectometerValue]);

  const resetAccident = useCallback(() => {
    setAccidentResult(null);
  }, []);

  const hasResult = useMemo(() => accidentResult !== null, [accidentResult]);

  return {
    direction,
    setDirection,
    reflectometerValue,
    setReflectometerValue,
    accidentResult,
    handleCalculate,
    resetAccident,
    hasResult,
  };
}
