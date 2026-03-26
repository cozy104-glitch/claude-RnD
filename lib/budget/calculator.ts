import type {
  PersonnelCost,
  EquipmentCost,
  TravelCost,
  MaterialCost,
  DirectCosts,
} from "@/lib/types/budget";

// 인건비 계산
export function calculatePersonnelTotal(cost: PersonnelCost): number {
  return Math.round(cost.monthlyRate * cost.months * (cost.participationRate / 100));
}

// 장비비 계산
export function calculateEquipmentTotal(cost: EquipmentCost): number {
  return cost.quantity * cost.unitPrice;
}

// 여비 계산
export function calculateTravelTotal(cost: TravelCost): number {
  return cost.trips * cost.costPerTrip;
}

// 재료비 계산
export function calculateMaterialTotal(cost: MaterialCost): number {
  return cost.quantity * cost.unitPrice;
}

// 직접비 소계 계산
export function calculateDirectCostsSubtotal(costs: DirectCosts): number {
  const personnel = costs.personnelCosts.reduce(
    (sum, c) => sum + calculatePersonnelTotal(c), 0
  );
  const equipment = costs.equipmentCosts.reduce(
    (sum, c) => sum + calculateEquipmentTotal(c), 0
  );
  const travel = costs.travelCosts.reduce(
    (sum, c) => sum + calculateTravelTotal(c), 0
  );
  const materials = costs.materialCosts.reduce(
    (sum, c) => sum + calculateMaterialTotal(c), 0
  );
  const outsourcing = costs.outsourcingCosts.reduce(
    (sum, c) => sum + c.amount, 0
  );
  const other = costs.otherCosts.reduce(
    (sum, c) => sum + c.amount, 0
  );
  return personnel + equipment + travel + materials + outsourcing + other;
}

// 간접비 계산
export function calculateIndirectCosts(directSubtotal: number, rate: number): number {
  return Math.round(directSubtotal * rate / 100);
}

// 총 예산 계산
export function calculateTotalBudget(directSubtotal: number, indirectAmount: number): number {
  return directSubtotal + indirectAmount;
}

// 원화 포맷팅
export function formatKRW(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);
}

// 원화 포맷팅 (통화기호 없이)
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(amount);
}
