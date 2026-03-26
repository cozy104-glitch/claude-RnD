// 정부 R&D 예산 카테고리 정의

export interface BudgetCategory {
  id: string;
  label: string;
  description: string;
}

// 직접비 카테고리
export const directCostCategories: BudgetCategory[] = [
  { id: "personnel", label: "인건비", description: "연구원 인건비 (연구책임자, 참여연구원 등)" },
  { id: "equipment", label: "연구장비·재료비", description: "연구용 장비 구입, 임차, 유지보수 비용" },
  { id: "travel", label: "연구활동비", description: "국내외 출장, 학회 참가 등 여비" },
  { id: "material", label: "재료비", description: "연구용 재료, 시약, 소모품 등" },
  { id: "outsourcing", label: "위탁연구비", description: "외부기관 위탁연구 비용" },
  { id: "other", label: "기타 경비", description: "기타 직접적 연구수행에 필요한 경비" },
];

// 간접비율 기본값 (기관 유형별)
export const defaultIndirectRates: Record<string, number> = {
  university: 33,    // 대학교
  government: 20,    // 정부출연연구기관
  enterprise: 15,    // 기업
  other: 20,         // 기타
};
