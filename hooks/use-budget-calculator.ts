"use client";

import { useMemo } from "react";
import type { DirectCosts, IndirectCosts } from "@/lib/types/budget";
import {
  calculateDirectCostsSubtotal,
  calculateIndirectCosts,
  calculateTotalBudget,
} from "@/lib/budget/calculator";

// 예산 반응형 계산 훅
export function useBudgetCalculator(
  directCosts: DirectCosts,
  indirectRate: number
) {
  return useMemo(() => {
    const directSubtotal = calculateDirectCostsSubtotal(directCosts);
    const indirectAmount = calculateIndirectCosts(directSubtotal, indirectRate);
    const total = calculateTotalBudget(directSubtotal, indirectAmount);

    const indirectCosts: IndirectCosts = {
      rate: indirectRate,
      amount: indirectAmount,
    };

    return {
      directSubtotal,
      indirectCosts,
      total,
    };
  }, [directCosts, indirectRate]);
}
