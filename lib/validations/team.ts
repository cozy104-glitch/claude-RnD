import { z } from "zod";
import { koreanName, percentageNumber, positiveNumber } from "./index";

// 연구원 스키마
export const teamMemberSchema = z.object({
  id: z.string(),
  name: koreanName,
  role: z.enum(["lead", "co_researcher", "participant", "advisor"]),
  affiliation: z.string().min(1, "소속기관을 입력해주세요"),
  department: z.string().default(""),
  position: z.string().default(""),
  specialization: z.string().default(""),
  education: z.string().default(""),
  experience: z.string().default(""),
  participationRate: percentageNumber,
  monthlyRate: positiveNumber,
});

export type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

// 연구팀 전체 스키마
export const researchTeamSchema = z.object({
  leadResearcher: teamMemberSchema,
  coResearchers: z.array(teamMemberSchema).default([]),
  participants: z.array(teamMemberSchema).default([]),
  externalAdvisors: z.array(teamMemberSchema).default([]),
});

export type ResearchTeamFormValues = z.infer<typeof researchTeamSchema>;
