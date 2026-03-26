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
import { contentSchema, type ContentFormValues } from "@/lib/validations/proposal";
import { useProposalStore } from "@/store/proposal-store";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useAiStream } from "@/hooks/use-ai-stream";

export default function ContentPage() {
  const { currentProposal, updateSection, saveProposal } = useProposalStore();
  const content = currentProposal?.sections.content;
  const { text: aiText, isStreaming, startStream } = useAiStream();

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: content || { scope: "", methodology: "", strategy: "" },
  });

  const watchedValues = form.watch();

  const handleSave = useCallback(() => {
    updateSection("content", watchedValues);
    saveProposal();
  }, [watchedValues, updateSection, saveProposal]);

  useAutoSave(watchedValues, handleSave);

  const onSubmit = (data: ContentFormValues) => {
    updateSection("content", data);
    saveProposal();
    toast.success("연구내용이 저장되었습니다.");
  };

  const handleAiGenerate = () => {
    startStream("/api/ai/generate", {
      sectionId: "content",
      proposalContext: currentProposal?.sections || {},
      language: "ko",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="연구내용"
        description="연구범위, 연구방법론, 추진전략을 작성합니다."
      />

      <div className="flex gap-2">
        <AiGenerateButton onClick={handleAiGenerate} isLoading={isStreaming} />
      </div>

      <AiStreamingText text={aiText} isStreaming={isStreaming} />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>연구범위</CardTitle></CardHeader>
          <CardContent>
            <Textarea
              rows={6}
              placeholder="본 연구에서 다루는 범위와 한계를 명확히 정의합니다."
              {...form.register("scope")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>연구방법론</CardTitle></CardHeader>
          <CardContent>
            <Textarea
              rows={8}
              placeholder="사용할 연구 방법, 기법, 도구를 구체적으로 기술합니다."
              {...form.register("methodology")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>추진전략</CardTitle></CardHeader>
          <CardContent>
            <Textarea
              rows={6}
              placeholder="연구 수행의 핵심 전략과 접근 방식을 기술합니다."
              {...form.register("strategy")}
            />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit">저장</Button>
        </div>
      </form>
    </div>
  );
}
