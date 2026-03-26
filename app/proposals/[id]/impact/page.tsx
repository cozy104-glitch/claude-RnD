"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { AiGenerateButton } from "@/components/ai/ai-generate-button";
import { AiStreamingText } from "@/components/ai/ai-streaming-text";
import { impactSchema, type ImpactFormValues } from "@/lib/validations/proposal";
import { useProposalStore } from "@/store/proposal-store";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useAiStream } from "@/hooks/use-ai-stream";

export default function ImpactPage() {
  const { currentProposal, updateSection, saveProposal } = useProposalStore();
  const impact = currentProposal?.sections.impact;
  const { text: aiText, isStreaming, startStream } = useAiStream();

  const form = useForm<ImpactFormValues>({
    resolver: zodResolver(impactSchema),
    defaultValues: impact || {},
  });

  const watchedValues = form.watch();

  const handleSave = useCallback(() => {
    updateSection("impact", watchedValues);
    saveProposal();
  }, [watchedValues, updateSection, saveProposal]);

  useAutoSave(watchedValues, handleSave);

  const onSubmit = (data: ImpactFormValues) => {
    updateSection("impact", data);
    saveProposal();
    toast.success("기대효과가 저장되었습니다.");
  };

  const handleAiGenerate = () => {
    startStream("/api/ai/generate", {
      sectionId: "impact",
      proposalContext: currentProposal?.sections || {},
      language: "ko",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="기대효과 및 활용방안"
        description="기술적, 경제적, 사회적 기대효과와 활용방안을 작성합니다."
      />

      <div className="flex gap-2">
        <AiGenerateButton onClick={handleAiGenerate} isLoading={isStreaming} />
      </div>

      <AiStreamingText text={aiText} isStreaming={isStreaming} />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>기술적 기대효과</CardTitle></CardHeader>
          <CardContent>
            <Textarea rows={6} placeholder="기술 발전에 대한 기여를 기술합니다." {...form.register("technicalImpact")} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>경제적 기대효과</CardTitle></CardHeader>
          <CardContent>
            <Textarea rows={6} placeholder="산업 활성화, 일자리 창출 등 경제적 파급효과를 기술합니다." {...form.register("economicImpact")} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>사회적 기대효과</CardTitle></CardHeader>
          <CardContent>
            <Textarea rows={6} placeholder="사회 문제 해결, 삶의 질 향상 등을 기술합니다." {...form.register("socialImpact")} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>활용방안</CardTitle></CardHeader>
          <CardContent>
            <Textarea rows={6} placeholder="연구 결과의 구체적 활용 계획을 기술합니다." {...form.register("utilizationPlan")} />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit">저장</Button>
        </div>
      </form>
    </div>
  );
}
