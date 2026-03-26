// 제안서 상태
export type ProposalStatus = "draft" | "in_progress" | "review" | "completed";

// 섹션 식별자
export type ProposalSectionId =
  | "overview"
  | "objectives"
  | "content"
  | "implementation"
  | "team"
  | "budget"
  | "impact"
  | "priorResearch";

// 섹션 진행 상태
export type SectionStatus = "not_started" | "in_progress" | "completed";

// 섹션 메타데이터
export interface ProposalSectionMeta {
  id: ProposalSectionId;
  title: string;
  status: SectionStatus;
  completionRate: number; // 0~100
  lastModified: string;
}

// 최상위 제안서 타입
export interface Proposal {
  id: string;
  title: string;
  programName: string;
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
  sections: ProposalSections;
  sectionMeta: ProposalSectionMeta[];
}

// 모든 섹션 데이터
export interface ProposalSections {
  overview: ResearchOverview;
  objectives: ResearchObjectives;
  content: ResearchContent;
  implementation: ImplementationPlan;
  team: ResearchTeam;
  budget: ResearchBudget;
  impact: ExpectedImpact;
  priorResearch: PriorResearch;
}

// ── 연구개요 ──
export interface ResearchOverview {
  programName: string;
  projectTitle: string;
  researchPeriod: {
    startDate: string;
    endDate: string;
    totalMonths: number;
  };
  totalBudget: number;
  governmentFunding: number;
  privateFunding: number;
  researchField: string;
  technologyArea: string;
  keywords: string[];
  summary: string;
}

// ── 연구목표 ──
export interface ResearchObjectives {
  finalGoal: string;
  annualGoals: AnnualGoal[];
  expectedEffects: string;
  targetMetrics: TargetMetric[];
}

export interface AnnualGoal {
  year: number;
  goal: string;
  milestones: string[];
}

export interface TargetMetric {
  name: string;
  unit: string;
  targetValue: string;
  evaluationMethod: string;
}

// ── 연구내용 ──
export interface ResearchContent {
  scope: string;
  methodology: string;
  strategy: string;
  detailedTasks: DetailedTask[];
}

export interface DetailedTask {
  id: string;
  title: string;
  description: string;
  period: string;
  assignee: string;
}

// ── 추진체계 ──
export interface ImplementationPlan {
  schedule: ScheduleItem[];
  roles: RoleAssignment[];
  collaborations: string;
}

export interface ScheduleItem {
  id: string;
  taskName: string;
  startMonth: number;
  endMonth: number;
  year: number;
  milestone: boolean;
}

export interface RoleAssignment {
  role: string;
  person: string;
  responsibilities: string;
}

// ── 연구팀 구성 ──
export interface ResearchTeam {
  leadResearcher: TeamMember;
  coResearchers: TeamMember[];
  participants: TeamMember[];
  externalAdvisors: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: "lead" | "co_researcher" | "participant" | "advisor";
  affiliation: string;
  department: string;
  position: string;
  specialization: string;
  education: string;
  experience: string;
  participationRate: number;
  monthlyRate: number;
}

// ── 연구예산 ──
import type { ResearchBudget } from "./budget";
export type { ResearchBudget };

// ── 기대효과 및 활용방안 ──
export interface ExpectedImpact {
  technicalImpact: string;
  economicImpact: string;
  socialImpact: string;
  utilizationPlan: string;
}

// ── 선행연구 분석 ──
export interface PriorResearch {
  domesticTrends: string;
  internationalTrends: string;
  differentiationPoints: string;
  references: ResearchReference[];
}

export interface ResearchReference {
  id: string;
  title: string;
  authors: string;
  year: string;
  source: string;
  relevance: string;
}
