"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { AiGenerateButton } from "@/components/ai/ai-generate-button";
import { AiStreamingText } from "@/components/ai/ai-streaming-text";
import { priorResearchSchema, type PriorResearchFormValues } from "@/lib/validations/proposal";
import { useProposalStore } from "@/store/proposal-store";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useAiStream } from "@/hooks/use-ai-stream";

export default function PriorResearchPage() {
  const { currentProposal, updateSection, saveProposal } = useProposalStore();
  const priorResearch = currentProposal?.sections.priorResearch;
  const { text: aiText, isStreaming, startStream } = useAiStream();

  const form = useForm<PriorResearchFormValues>({
    resolver: zodResolver(priorResearchSchema),
    defaultValues: priorResearch || {},
  });

  const watchedValues = form.watch();

  const handleAutoSave = () => {
    updateSection("priorResearch", watchedValues);
    saveProposal();
  };

  useAutoSave(watchedValues, handleAutoSave);

  const onSubmit = (data: PriorResearchFormValues) => {
    updateSection("priorResearch", data);
    saveProposal();
    toast.success("선행연구 분석이 저장되었습니다.");
  };

  const handleAiGenerate = () => {
    startStream("/api/ai/generate", {
      sectionId: "priorResearch",
      proposalContext: currentProposal?.sections || {},
      language: "ko",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="선행연구 분석"
        description="국내외 연구동향과 본 연구의 차별성을 분석합니다."
      />

      <div className="flex gap-2">
        <AiGenerateButton onClick={handleAiGenerate} isLoading={isStreaming} />
      </div>

      <AiStreamingText text={aiText} isStreaming={isStreaming} />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>국내 연구동향</CardTitle></CardHeader>
          <CardContent>
            <Textarea rows={8} placeholder="관련 분야 국내 연구 현황을 분석합니다." {...form.register("domesticTrends")} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>해외 연구동향</CardTitle></CardHeader>
          <CardContent>
            <Textarea rows={8} placeholder="관련 분야 해외 연구 현황을 분석합니다." {...form.register("internationalTrends")} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>본 연구의 차별성</CardTitle></CardHeader>
          <CardContent>
            <Textarea rows={6} placeholder="기존 연구 대비 본 연구만의 차별점과 독창성을 기술합니다." {...form.register("differentiationPoints")} />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit">저장</Button>
        </div>
      </form>
    </div>
  );
}
