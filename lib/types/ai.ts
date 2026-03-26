import type { ProposalSectionId, ProposalSections } from "./proposal";

// AI 초안 생성 요청 DTO
export interface AiGenerateRequestDto {
  sectionId: ProposalSectionId;
  proposalContext: Partial<ProposalSections>;
  userPrompt?: string;
  language: "ko";
}

// AI 검토 요청 DTO
export interface AiReviewRequestDto {
  sectionId: ProposalSectionId;
  content: string;
  proposalContext: Partial<ProposalSections>;
}

// AI 자동완성 요청 DTO
export interface AiCompleteRequestDto {
  sectionId: ProposalSectionId;
  partialContent: string;
  cursorPosition: number;
}

// AI 초안 생성 응답 DTO
export interface AiGenerateResponseDto {
  generatedContent: string;
  confidence: number; // 0~1
  suggestions: string[];
}

// AI 검토 응답 DTO
export interface AiReviewResponseDto {
  overallScore: number; // 1~10
  strengths: string[];
  improvements: AiImprovement[];
  revisedContent?: string;
}

// 개선 제안 항목
export interface AiImprovement {
  category: "clarity" | "completeness" | "specificity" | "formatting" | "consistency";
  description: string;
  suggestion: string;
  originalText?: string;
  suggestedText?: string;
}

// AI 자동완성 응답 DTO
export interface AiCompleteResponseDto {
  completedText: string;
  alternatives: string[];
}

// AI 개선 카테고리 한국어 라벨
export const aiCategoryLabels: Record<AiImprovement["category"], string> = {
  clarity: "명확성",
  completeness: "완전성",
  specificity: "구체성",
  formatting: "형식",
  consistency: "일관성",
};
