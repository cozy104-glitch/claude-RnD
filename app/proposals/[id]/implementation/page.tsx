"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { AiGenerateButton } from "@/components/ai/ai-generate-button";
import { AiStreamingText } from "@/components/ai/ai-streaming-text";
import { Callout } from "@/components/shared/callout";
import { useProposalStore } from "@/store/proposal-store";
import { useAiStream } from "@/hooks/use-ai-stream";
import { useState } from "react";

export default function ImplementationPage() {
  const { currentProposal, updateSection, saveProposal } = useProposalStore();
  const implementation = currentProposal?.sections.implementation;
  const { text: aiText, isStreaming, startStream } = useAiStream();

  const [collaborations, setCollaborations] = useState(implementation?.collaborations || "");

  const handleSave = useCallback(() => {
    if (!implementation) return;
    updateSection("implementation", {
      ...implementation,
      collaborations,
    });
    saveProposal();
    toast.success("추진체계가 저장되었습니다.");
  }, [collaborations, implementation, updateSection, saveProposal]);

  const handleAiGenerate = () => {
    startStream("/api/ai/generate", {
      sectionId: "implementation",
      proposalContext: currentProposal?.sections || {},
      language: "ko",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="추진체계"
        description="추진일정, 역할분담, 협력체계를 작성합니다."
      />

      <div className="flex gap-2">
        <AiGenerateButton onClick={handleAiGenerate} isLoading={isStreaming} />
      </div>

      <AiStreamingText text={aiText} isStreaming={isStreaming} />

      <Callout variant="info" title="간트차트">
        간트차트 시각화 기능은 Phase 4에서 추가될 예정입니다.
        현재는 텍스트로 추진일정을 작성해주세요.
      </Callout>

      <Card>
        <CardHeader>
          <CardTitle>협력체계</CardTitle>
          <CardDescription>참여기관 간 협력 방안을 기술합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="collaborations">협력체계 설명</Label>
            <Textarea
              id="collaborations"
              rows={8}
              placeholder="참여기관 간 역할분담, 협력 방식, 의사소통 체계 등을 기술합니다."
              value={collaborations}
              onChange={(e) => setCollaborations(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave}>저장</Button>
      </div>
    </div>
  );
}
