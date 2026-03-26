"use client";

import Link from "next/link";
import { FileText, Calendar, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Proposal } from "@/lib/types/proposal";

// 상태별 라벨 및 배지 variant
const statusConfig: Record<
  Proposal["status"],
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  draft: { label: "초안", variant: "outline" },
  in_progress: { label: "작성 중", variant: "secondary" },
  review: { label: "검토 중", variant: "default" },
  completed: { label: "완료", variant: "default" },
};

interface ProposalCardProps {
  proposal: Proposal;
  onDelete?: (id: string) => void;
}

// 제안서 목록 카드
export function ProposalCard({ proposal, onDelete }: ProposalCardProps) {
  const { label, variant } = statusConfig[proposal.status];

  // 전체 완성도 계산
  const totalCompletion = proposal.sectionMeta.length > 0
    ? Math.round(
        proposal.sectionMeta.reduce((sum, m) => sum + m.completionRate, 0) /
        proposal.sectionMeta.length
      )
    : 0;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg">
            <Link
              href={`/proposals/${proposal.id}`}
              className="hover:underline"
            >
              {proposal.title || "제목 없음"}
            </Link>
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <FileText className="size-3" />
            {proposal.programName || "사업명 미지정"}
          </CardDescription>
        </div>
        <Badge variant={variant}>{label}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 진행률 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">진행률</span>
            <span className="font-medium">{totalCompletion}%</span>
          </div>
          <Progress value={totalCompletion} className="h-2" />
        </div>

        {/* 하단 정보 */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {new Date(proposal.updatedAt).toLocaleDateString("ko-KR")}
          </span>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.preventDefault();
                onDelete(proposal.id);
              }}
            >
              <Trash2 className="size-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
