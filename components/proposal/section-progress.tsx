"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { ProposalSectionMeta } from "@/lib/types/proposal";

const statusLabels = {
  not_started: "미시작",
  in_progress: "작성 중",
  completed: "완료",
} as const;

const statusVariants: Record<
  ProposalSectionMeta["status"],
  "outline" | "secondary" | "default"
> = {
  not_started: "outline",
  in_progress: "secondary",
  completed: "default",
};

interface SectionProgressProps {
  meta: ProposalSectionMeta;
}

// 섹션별 진행률 표시
export function SectionProgress({ meta }: SectionProgressProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{meta.title}</span>
        <Badge variant={statusVariants[meta.status]} className="text-xs">
          {statusLabels[meta.status]}
        </Badge>
      </div>
      <Progress value={meta.completionRate} className="h-1.5" />
    </div>
  );
}
