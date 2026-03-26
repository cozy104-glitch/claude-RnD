import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Proposal,
  ProposalSectionId,
  ProposalSections,
  ProposalSectionMeta,
  ProposalStatus,
} from "@/lib/types/proposal";
import type { ResearchBudget } from "@/lib/types/budget";
import { proposalSections } from "@/lib/constants";

// 빈 제안서 초기값 생성
function createEmptyProposal(title: string, programName: string): Proposal {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title,
    programName,
    status: "draft" as ProposalStatus,
    createdAt: now,
    updatedAt: now,
    sections: createEmptySections(),
    sectionMeta: proposalSections.map((s) => ({
      id: s.sectionId,
      title: s.title,
      status: "not_started" as const,
      completionRate: 0,
      lastModified: now,
    })),
  };
}

function createEmptySections(): ProposalSections {
  return {
    overview: {
      programName: "",
      projectTitle: "",
      researchPeriod: { startDate: "", endDate: "", totalMonths: 0 },
      totalBudget: 0,
      governmentFunding: 0,
      privateFunding: 0,
      researchField: "",
      technologyArea: "",
      keywords: [],
      summary: "",
    },
    objectives: {
      finalGoal: "",
      annualGoals: [],
      expectedEffects: "",
      targetMetrics: [],
    },
    content: {
      scope: "",
      methodology: "",
      strategy: "",
      detailedTasks: [],
    },
    implementation: {
      schedule: [],
      roles: [],
      collaborations: "",
    },
    team: {
      leadResearcher: {
        id: crypto.randomUUID(),
        name: "",
        role: "lead",
        affiliation: "",
        department: "",
        position: "",
        specialization: "",
        education: "",
        experience: "",
        participationRate: 100,
        monthlyRate: 0,
      },
      coResearchers: [],
      participants: [],
      externalAdvisors: [],
    },
    budget: {
      totalAmount: 0,
      directCosts: {
        personnelCosts: [],
        equipmentCosts: [],
        travelCosts: [],
        materialCosts: [],
        outsourcingCosts: [],
        otherCosts: [],
        subtotal: 0,
      },
      indirectCosts: { rate: 20, amount: 0 },
      annualBreakdown: [],
    } as ResearchBudget,
    impact: {
      technicalImpact: "",
      economicImpact: "",
      socialImpact: "",
      utilizationPlan: "",
    },
    priorResearch: {
      domesticTrends: "",
      internationalTrends: "",
      differentiationPoints: "",
      references: [],
    },
  };
}

interface ProposalStore {
  // 제안서 목록
  proposals: Proposal[];
  // 현재 편집중인 제안서
  currentProposal: Proposal | null;
  isDirty: boolean;

  // 액션
  // loadProposalList 제거: persist 미들웨어가 자동으로 localStorage에서 복원하므로 별도 로드 함수 불필요
  createProposal: (title: string, programName: string) => string;
  loadProposal: (id: string) => void;
  updateSection: <K extends ProposalSectionId>(
    sectionId: K,
    data: ProposalSections[K]
  ) => void;
  updateSectionMeta: (
    sectionId: ProposalSectionId,
    meta: Partial<ProposalSectionMeta>
  ) => void;
  saveProposal: () => void;
  deleteProposal: (id: string) => void;
  setDirty: (dirty: boolean) => void;
}

export const useProposalStore = create<ProposalStore>()(
  persist(
    (set, get) => ({
      proposals: [],
      currentProposal: null,
      isDirty: false,

      createProposal: (title: string, programName: string) => {
        const proposal = createEmptyProposal(title, programName);
        set((state) => ({
          proposals: [...state.proposals, proposal],
          currentProposal: proposal,
          isDirty: false,
        }));
        return proposal.id;
      },

      loadProposal: (id: string) => {
        const { proposals } = get();
        const proposal = proposals.find((p) => p.id === id) || null;
        set({ currentProposal: proposal, isDirty: false });
      },

      updateSection: (sectionId, data) => {
        set((state) => {
          if (!state.currentProposal) return state;
          const now = new Date().toISOString();
          return {
            currentProposal: {
              ...state.currentProposal,
              updatedAt: now,
              sections: {
                ...state.currentProposal.sections,
                [sectionId]: data,
              },
              sectionMeta: state.currentProposal.sectionMeta.map((meta) =>
                meta.id === sectionId
                  ? { ...meta, status: "in_progress" as const, lastModified: now }
                  : meta
              ),
            },
            isDirty: true,
          };
        });
      },

      updateSectionMeta: (sectionId, metaUpdate) => {
        set((state) => {
          if (!state.currentProposal) return state;
          return {
            currentProposal: {
              ...state.currentProposal,
              sectionMeta: state.currentProposal.sectionMeta.map((meta) =>
                meta.id === sectionId ? { ...meta, ...metaUpdate } : meta
              ),
            },
          };
        });
      },

      saveProposal: () => {
        const { currentProposal, proposals } = get();
        if (!currentProposal) return;
        const updatedProposals = proposals.map((p) =>
          p.id === currentProposal.id ? currentProposal : p
        );
        set({ proposals: updatedProposals, isDirty: false });
      },

      deleteProposal: (id: string) => {
        set((state) => ({
          proposals: state.proposals.filter((p) => p.id !== id),
          currentProposal:
            state.currentProposal?.id === id ? null : state.currentProposal,
        }));
      },

      setDirty: (dirty: boolean) => set({ isDirty: dirty }),
    }),
    {
      name: "gov-proposal-storage",
    }
  )
);
