// 예산 최상위
export interface ResearchBudget {
  totalAmount: number;
  directCosts: DirectCosts;
  indirectCosts: IndirectCosts;
  annualBreakdown: AnnualBudget[];
}

// 직접비 구성
export interface DirectCosts {
  personnelCosts: PersonnelCost[];
  equipmentCosts: EquipmentCost[];
  travelCosts: TravelCost[];
  materialCosts: MaterialCost[];
  outsourcingCosts: OutsourcingCost[];
  otherCosts: OtherCost[];
  subtotal: number;
}

// 인건비
export interface PersonnelCost {
  id: string;
  name: string;
  role: string;
  monthlyRate: number;
  months: number;
  participationRate: number;
  total: number; // 자동계산: monthlyRate * months * participationRate / 100
}

// 연구장비비
export interface EquipmentCost {
  id: string;
  name: string;
  specification: string;
  quantity: number;
  unitPrice: number;
  total: number;
  purpose: string;
}

// 여비
export interface TravelCost {
  id: string;
  destination: string;
  purpose: string;
  trips: number;
  costPerTrip: number;
  total: number;
}

// 재료비
export interface MaterialCost {
  id: string;
  name: string;
  specification: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// 위탁연구비
export interface OutsourcingCost {
  id: string;
  description: string;
  organization: string;
  amount: number;
}

// 기타 직접비
export interface OtherCost {
  id: string;
  description: string;
  amount: number;
}

// 간접비
export interface IndirectCosts {
  rate: number;   // 간접비율 (%)
  amount: number; // 자동계산: directCosts.subtotal * rate / 100
}

// 연차별 예산
export interface AnnualBudget {
  year: number;
  directCosts: number;
  indirectCosts: number;
  total: number;
}
