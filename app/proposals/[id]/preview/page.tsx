"use client";

import { useProposalStore } from "@/store/proposal-store";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Callout } from "@/components/shared/callout";
import { Download } from "lucide-react";
import { formatKRW } from "@/lib/budget/calculator";
import type { ResearchBudget } from "@/lib/types/budget";

// 전체 미리보기 페이지
export default function PreviewPage() {
  const { currentProposal } = useProposalStore();

  if (!currentProposal) {
    return <p className="text-muted-foreground">제안서를 불러오는 중...</p>;
  }

  const { sections } = currentProposal;
  const budget = sections.budget as ResearchBudget;

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="제안서 미리보기"
        description="작성된 제안서의 전체 내용을 미리봅니다."
      />

      <Callout variant="info" title="PDF 내보내기">
        PDF 내보내기 기능은 Phase 5에서 추가될 예정입니다.
      </Callout>

      <Button variant="outline" disabled>
        <Download className="mr-2 size-4" />
        PDF 내보내기 (준비 중)
      </Button>

      {/* 1. 연구개요 */}
      <Card>
        <CardHeader><CardTitle>1. 연구개요</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div><span className="font-medium">사업명:</span> {sections.overview.programName || "-"}</div>
            <div><span className="font-medium">과제명:</span> {sections.overview.projectTitle || "-"}</div>
            <div><span className="font-medium">연구기간:</span> {sections.overview.researchPeriod.startDate || "-"} ~ {sections.overview.researchPeriod.endDate || "-"}</div>
            <div><span className="font-medium">총연구비:</span> {formatKRW(sections.overview.totalBudget || 0)}</div>
          </div>
          {sections.overview.summary && (
            <>
              <Separator />
              <div>
                <span className="font-medium">연구요약:</span>
                <p className="mt-1 whitespace-pre-wrap">{sections.overview.summary}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 2. 연구목표 */}
      <Card>
        <CardHeader><CardTitle>2. 연구목표</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm whitespace-pre-wrap">
          {sections.objectives.finalGoal || <span className="text-muted-foreground">미작성</span>}
        </CardContent>
      </Card>

      {/* 3. 연구내용 */}
      <Card>
        <CardHeader><CardTitle>3. 연구내용</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          {sections.content.scope && (
            <div>
              <span className="font-medium">연구범위:</span>
              <p className="mt-1 whitespace-pre-wrap">{sections.content.scope}</p>
            </div>
          )}
          {sections.content.methodology && (
            <div>
              <span className="font-medium">연구방법론:</span>
              <p className="mt-1 whitespace-pre-wrap">{sections.content.methodology}</p>
            </div>
          )}
          {sections.content.strategy && (
            <div>
              <span className="font-medium">추진전략:</span>
              <p className="mt-1 whitespace-pre-wrap">{sections.content.strategy}</p>
            </div>
          )}
          {!sections.content.scope && !sections.content.methodology && !sections.content.strategy && (
            <span className="text-muted-foreground">미작성</span>
          )}
        </CardContent>
      </Card>

      {/* 4. 추진체계 */}
      <Card>
        <CardHeader><CardTitle>4. 추진체계</CardTitle></CardHeader>
        <CardContent className="text-sm whitespace-pre-wrap">
          {sections.implementation.collaborations || <span className="text-muted-foreground">미작성</span>}
        </CardContent>
      </Card>

      {/* 5. 연구팀 */}
      <Card>
        <CardHeader><CardTitle>5. 연구팀 구성</CardTitle></CardHeader>
        <CardContent className="text-sm">
          <div className="space-y-2">
            <div>
              <span className="font-medium">책임연구원:</span>{" "}
              {sections.team.leadResearcher.name || "-"} ({sections.team.leadResearcher.affiliation || "-"})
            </div>
            {sections.team.coResearchers.length > 0 && (
              <div>
                <span className="font-medium">공동연구원:</span>{" "}
                {sections.team.coResearchers.map((m) => m.name).join(", ")}
              </div>
            )}
            {sections.team.participants.length > 0 && (
              <div>
                <span className="font-medium">참여연구원:</span>{" "}
                {sections.team.participants.map((m) => m.name).join(", ")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 6. 예산 */}
      <Card>
        <CardHeader><CardTitle>6. 연구예산</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>직접비</span>
            <span>{formatKRW(budget?.directCosts.subtotal || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>간접비 ({budget?.indirectCosts.rate || 0}%)</span>
            <span>{formatKRW(budget?.indirectCosts.amount || 0)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>총 연구비</span>
            <span>{formatKRW(budget?.totalAmount || 0)}</span>
          </div>
        </CardContent>
      </Card>

      {/* 7. 기대효과 */}
      <Card>
        <CardHeader><CardTitle>7. 기대효과 및 활용방안</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          {sections.impact.technicalImpact && (
            <div>
              <span className="font-medium">기술적:</span>
              <p className="mt-1 whitespace-pre-wrap">{sections.impact.technicalImpact}</p>
            </div>
          )}
          {sections.impact.economicImpact && (
            <div>
              <span className="font-medium">경제적:</span>
              <p className="mt-1 whitespace-pre-wrap">{sections.impact.economicImpact}</p>
            </div>
          )}
          {!sections.impact.technicalImpact && !sections.impact.economicImpact && (
            <span className="text-muted-foreground">미작성</span>
          )}
        </CardContent>
      </Card>

      {/* 8. 선행연구 */}
      <Card>
        <CardHeader><CardTitle>8. 선행연구 분석</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          {sections.priorResearch.domesticTrends && (
            <div>
              <span className="font-medium">국내:</span>
              <p className="mt-1 whitespace-pre-wrap">{sections.priorResearch.domesticTrends}</p>
            </div>
          )}
          {sections.priorResearch.differentiationPoints && (
            <div>
              <span className="font-medium">차별성:</span>
              <p className="mt-1 whitespace-pre-wrap">{sections.priorResearch.differentiationPoints}</p>
            </div>
          )}
          {!sections.priorResearch.domesticTrends && !sections.priorResearch.differentiationPoints && (
            <span className="text-muted-foreground">미작성</span>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
