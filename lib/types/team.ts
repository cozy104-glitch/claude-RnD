// 연구팀 관련 타입은 proposal.ts의 TeamMember에서 통합 관리
// 여기서는 팀 관련 유틸리티 타입만 추가 정의

export type TeamMemberRole = "lead" | "co_researcher" | "participant" | "advisor";

// 역할별 한국어 라벨
export const teamRoleLabels: Record<TeamMemberRole, string> = {
  lead: "책임연구원",
  co_researcher: "공동연구원",
  participant: "참여연구원",
  advisor: "외부 자문위원",
};

// 새 팀원 기본값 생성
export function createDefaultTeamMember(role: TeamMemberRole) {
  return {
    id: crypto.randomUUID(),
    name: "",
    role,
    affiliation: "",
    department: "",
    position: "",
    specialization: "",
    education: "",
    experience: "",
    participationRate: 100,
    monthlyRate: 0,
  };
}
