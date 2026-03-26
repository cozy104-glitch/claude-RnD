"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/page-header";
import { AiGenerateButton } from "@/components/ai/ai-generate-button";
import { AiStreamingText } from "@/components/ai/ai-streaming-text";
import { KoreanCurrencyInput } from "@/components/proposal/korean-currency-input";
import { overviewSchema, type OverviewFormValues } from "@/lib/validations/proposal";
import { useProposalStore } from "@/store/proposal-store";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useAiStream } from "@/hooks/use-ai-stream";

export default function OverviewPage() {
  const { currentProposal, updateSection, saveProposal } = useProposalStore();
  const overview = currentProposal?.sections.overview;
  const { text: aiText, isStreaming, startStream } = useAiStream();

  const form = useForm<OverviewFormValues>({
    resolver: zodResolver(overviewSchema),
    defaultValues: overview || {},
  });

  const watchedValues = form.watch();

  // useAutoSave에 전달되는 함수는 내부적으로 ref로 관리되므로 useCallback 불필요
  const handleAutoSave = () => {
    updateSection("overview", watchedValues);
    saveProposal();
  };

  useAutoSave(watchedValues, handleAutoSave);

  const onSubmit = (data: OverviewFormValues) => {
    updateSection("overview", data);
    saveProposal();
    toast.success("연구개요가 저장되었습니다.");
  };

  const handleAiGenerate = () => {
    startStream("/api/ai/generate", {
      sectionId: "overview",
      proposalContext: currentProposal?.sections || {},
      language: "ko",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="연구개요"
        description="과제의 기본 정보와 연구 요약을 작성합니다."
      />

      <div className="flex gap-2">
        <AiGenerateButton onClick={handleAiGenerate} isLoading={isStreaming} />
      </div>

      <AiStreamingText text={aiText} isStreaming={isStreaming} />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="programName">사업명</Label>
                <Input id="programName" {...form.register("programName")} />
                {form.formState.errors.programName && (
                  <p className="text-sm text-destructive">{form.formState.errors.programName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectTitle">과제명</Label>
                <Input id="projectTitle" {...form.register("projectTitle")} />
                {form.formState.errors.projectTitle && (
                  <p className="text-sm text-destructive">{form.formState.errors.projectTitle.message}</p>
                )}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="startDate">연구 시작일</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...form.register("researchPeriod.startDate")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">연구 종료일</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...form.register("researchPeriod.endDate")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalMonths">총 연구기간 (월)</Label>
                <Input
                  id="totalMonths"
                  type="number"
                  {...form.register("researchPeriod.totalMonths", { valueAsNumber: true })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>연구비</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>총 연구비</Label>
                <KoreanCurrencyInput
                  value={form.watch("totalBudget") || 0}
                  onChange={(v) => form.setValue("totalBudget", v)}
                />
              </div>
              <div className="space-y-2">
                <Label>정부출연금</Label>
                <KoreanCurrencyInput
                  value={form.watch("governmentFunding") || 0}
                  onChange={(v) => form.setValue("governmentFunding", v)}
                />
              </div>
              <div className="space-y-2">
                <Label>민간부담금</Label>
                <KoreanCurrencyInput
                  value={form.watch("privateFunding") || 0}
                  onChange={(v) => form.setValue("privateFunding", v)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>연구 분야 및 요약</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="researchField">연구분야</Label>
                <Input id="researchField" {...form.register("researchField")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="technologyArea">기술분류</Label>
                <Input id="technologyArea" {...form.register("technologyArea")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">연구요약 (300자 이내)</Label>
              <Textarea
                id="summary"
                rows={6}
                placeholder="연구의 필요성, 목적, 주요 내용을 요약합니다."
                {...form.register("summary")}
              />
              {form.formState.errors.summary && (
                <p className="text-sm text-destructive">{form.formState.errors.summary.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit">저장</Button>
        </div>
      </form>
    </div>
  );
}
