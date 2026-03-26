"use client";

import { useProposalStore } from "@/store/proposal-store";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { SectionProgress } from "@/components/proposal/section-progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle2, Clock, BarChart3 } from "lucide-react";

// 제안서 대시보드 — 전체 진행 현황
export default function ProposalDashboardPage() {
  const { currentProposal } = useProposalStore();

  if (!currentProposal) {
    return <p className="text-muted-foreground">제안서를 불러오는 중...</p>;
  }

  const { sectionMeta } = currentProposal;

  const completedCount = sectionMeta.filter((m) => m.status === "completed").length;
  const inProgressCount = sectionMeta.filter((m) => m.status === "in_progress").length;
  const totalCompletion = sectionMeta.length > 0
    ? Math.round(sectionMeta.reduce((sum, m) => sum + m.completionRate, 0) / sectionMeta.length)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={currentProposal.title || "제목 없음"}
        description={currentProposal.programName || "사업명 미지정"}
      />

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="전체 진행률"
          value={`${totalCompletion}%`}
          icon={<BarChart3 className="size-4" />}
        />
        <StatCard
          title="전체 섹션"
          value={`${sectionMeta.length}개`}
          icon={<FileText className="size-4" />}
        />
        <StatCard
          title="완료 섹션"
          value={`${completedCount}개`}
          icon={<CheckCircle2 className="size-4" />}
        />
        <StatCard
          title="작성 중"
          value={`${inProgressCount}개`}
          icon={<Clock className="size-4" />}
        />
      </div>

      {/* 섹션별 진행률 */}
      <Card>
        <CardHeader>
          <CardTitle>섹션별 진행 현황</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sectionMeta.map((meta) => (
            <SectionProgress key={meta.id} meta={meta} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
