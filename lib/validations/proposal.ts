import { z } from "zod";
import { requiredString } from "./index";

// 새 제안서 생성 스키마
export const createProposalSchema = z.object({
  title: requiredString.max(200, "과제명은 최대 200자까지 입력할 수 있습니다"),
  programName: requiredString.max(100, "사업명은 최대 100자까지 입력할 수 있습니다"),
});

export type CreateProposalFormValues = z.infer<typeof createProposalSchema>;

// 연구개요 스키마
export const overviewSchema = z.object({
  programName: z.string(),
  projectTitle: z.string(),
  researchPeriod: z.object({
    startDate: z.string(),
    endDate: z.string(),
    totalMonths: z.number(),
  }),
  totalBudget: z.number(),
  governmentFunding: z.number(),
  privateFunding: z.number(),
  researchField: z.string(),
  technologyArea: z.string(),
  keywords: z.array(z.string()),
  summary: z.string().max(300, "연구요약은 최대 300자까지 입력할 수 있습니다"),
});

export type OverviewFormValues = z.infer<typeof overviewSchema>;

// 연구목표 스키마
export const objectivesSchema = z.object({
  finalGoal: z.string().max(2000, "최종목표는 최대 2000자까지 입력할 수 있습니다"),
  annualGoals: z.array(z.object({
    year: z.number(),
    goal: z.string(),
    milestones: z.array(z.string()),
  })),
  expectedEffects: z.string(),
  targetMetrics: z.array(z.object({
    name: z.string(),
    unit: z.string(),
    targetValue: z.string(),
    evaluationMethod: z.string(),
  })),
});

export type ObjectivesFormValues = z.infer<typeof objectivesSchema>;

// 연구내용 스키마
export const contentSchema = z.object({
  scope: z.string(),
  methodology: z.string(),
  strategy: z.string(),
  detailedTasks: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    period: z.string(),
    assignee: z.string(),
  })),
});

export type ContentFormValues = z.infer<typeof contentSchema>;

// 기대효과 스키마
export const impactSchema = z.object({
  technicalImpact: z.string(),
  economicImpact: z.string(),
  socialImpact: z.string(),
  utilizationPlan: z.string(),
});

export type ImpactFormValues = z.infer<typeof impactSchema>;

// 선행연구 스키마
export const priorResearchSchema = z.object({
  domesticTrends: z.string(),
  internationalTrends: z.string(),
  differentiationPoints: z.string(),
  references: z.array(z.object({
    id: z.string(),
    title: z.string(),
    authors: z.string(),
    year: z.string(),
    source: z.string(),
    relevance: z.string(),
  })),
});

export type PriorResearchFormValues = z.infer<typeof priorResearchSchema>;
