import { z } from "zod";

// 인건비 항목
export const personnelCostSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "이름을 입력해주세요"),
  role: z.string().min(1, "역할을 입력해주세요"),
  monthlyRate: z.number().min(0, "0 이상이어야 합니다"),
  months: z.number().min(1, "최소 1개월 이상이어야 합니다"),
  participationRate: z.number().min(0).max(100, "100 이하여야 합니다"),
  total: z.number(),
});

// 장비비 항목
export const equipmentCostSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "장비명을 입력해주세요"),
  specification: z.string().default(""),
  quantity: z.number().min(1, "최소 1개 이상이어야 합니다"),
  unitPrice: z.number().min(0),
  total: z.number(),
  purpose: z.string().default(""),
});

// 여비 항목
export const travelCostSchema = z.object({
  id: z.string(),
  destination: z.string().default(""),
  purpose: z.string().default(""),
  trips: z.number().min(1),
  costPerTrip: z.number().min(0),
  total: z.number(),
});

// 재료비 항목
export const materialCostSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "재료명을 입력해주세요"),
  specification: z.string().default(""),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  total: z.number(),
});

// 위탁연구비 항목
export const outsourcingCostSchema = z.object({
  id: z.string(),
  description: z.string().default(""),
  organization: z.string().default(""),
  amount: z.number().min(0),
});

// 기타 직접비 항목
export const otherCostSchema = z.object({
  id: z.string(),
  description: z.string().default(""),
  amount: z.number().min(0),
});

// 전체 예산 스키마
export const budgetSchema = z.object({
  totalAmount: z.number(),
  directCosts: z.object({
    personnelCosts: z.array(personnelCostSchema).default([]),
    equipmentCosts: z.array(equipmentCostSchema).default([]),
    travelCosts: z.array(travelCostSchema).default([]),
    materialCosts: z.array(materialCostSchema).default([]),
    outsourcingCosts: z.array(outsourcingCostSchema).default([]),
    otherCosts: z.array(otherCostSchema).default([]),
    subtotal: z.number(),
  }),
  indirectCosts: z.object({
    rate: z.number().min(0).max(100),
    amount: z.number(),
  }),
  annualBreakdown: z.array(z.object({
    year: z.number(),
    directCosts: z.number(),
    indirectCosts: z.number(),
    total: z.number(),
  })).default([]),
});

export type BudgetFormValues = z.infer<typeof budgetSchema>;
