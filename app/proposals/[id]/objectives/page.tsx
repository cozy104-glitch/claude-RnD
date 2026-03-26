"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { AiGenerateButton } from "@/components/ai/ai-generate-button";
import { AiStreamingText } from "@/components/ai/ai-streaming-text";
import { objectivesSchema, type ObjectivesFormValues } from "@/lib/validations/proposal";
import { useProposalStore } from "@/store/proposal-store";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useAiStream } from "@/hooks/use-ai-stream";

export default function ObjectivesPage() {
  const { currentProposal, updateSection, saveProposal } = useProposalStore();
  const objectives = currentProposal?.sections.objectives;
  const { text: aiText, isStreaming, startStream } = useAiStream();

  const form = useForm<ObjectivesFormValues>({
    resolver: zodResolver(objectivesSchema),
    defaultValues: objectives || { finalGoal: "", expectedEffects: "" },
  });

  const watchedValues = form.watch();

  const handleSave = useCallback(() => {
    updateSection("objectives", watchedValues);
    saveProposal();
  }, [watchedValues, updateSection, saveProposal]);

  useAutoSave(watchedValues, handleSave);

  const onSubmit = (data: ObjectivesFormValues) => {
    updateSection("objectives", data);
    saveProposal();
    toast.success("연구목표가 저장되었습니다.");
  };

  const handleAiGenerate = () => {
    startStream("/api/ai/generate", {
      sectionId: "objectives",
      proposalContext: currentProposal?.sections || {},
      language: "ko",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="연구목표"
        description="최종목표, 연차별 목표, 정량적 성과지표를 작성합니다."
      />

      <div className="flex gap-2">
        <AiGenerateButton onClick={handleAiGenerate} isLoading={isStreaming} />
      </div>

      <AiStreamingText text={aiText} isStreaming={isStreaming} />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>최종목표</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="finalGoal">연구 최종 목표</Label>
              <Textarea
                id="finalGoal"
                rows={8}
                placeholder="연구 완료 시 달성하고자 하는 최종 성과를 구체적으로 작성합니다."
                {...form.register("finalGoal")}
              />
              {form.formState.errors.finalGoal && (
                <p className="text-sm text-destructive">{form.formState.errors.finalGoal.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>기대효과</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="expectedEffects">기대효과 요약</Label>
              <Textarea
                id="expectedEffects"
                rows={6}
                placeholder="연구 성공 시 예상되는 기술적, 경제적, 사회적 효과를 작성합니다."
                {...form.register("expectedEffects")}
              />
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
