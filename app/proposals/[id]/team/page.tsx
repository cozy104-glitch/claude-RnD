"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/page-header";
import { AiGenerateButton } from "@/components/ai/ai-generate-button";
import { AiStreamingText } from "@/components/ai/ai-streaming-text";
import type { TeamMember } from "@/lib/types/proposal";
import { teamRoleLabels, createDefaultTeamMember } from "@/lib/types/team";
import { useProposalStore } from "@/store/proposal-store";
import { useAiStream } from "@/hooks/use-ai-stream";

// 연구원 편집 카드
function TeamMemberEditor({
  member,
  onChange,
  onRemove,
  removable = true,
}: {
  member: TeamMember;
  onChange: (updated: TeamMember) => void;
  onRemove?: () => void;
  removable?: boolean;
}) {
  const update = (field: keyof TeamMember, value: string | number) => {
    onChange({ ...member, [field]: value });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <User className="size-4" />
          <Badge variant="outline">{teamRoleLabels[member.role]}</Badge>
          {member.name && <span className="font-medium">{member.name}</span>}
        </div>
        {removable && onRemove && (
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="size-4 text-destructive" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <Label>이름</Label>
            <Input value={member.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>소속기관</Label>
            <Input value={member.affiliation} onChange={(e) => update("affiliation", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>부서</Label>
            <Input value={member.department} onChange={(e) => update("department", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>직위</Label>
            <Input value={member.position} onChange={(e) => update("position", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>전문분야</Label>
            <Input value={member.specialization} onChange={(e) => update("specialization", e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>참여율 (%)</Label>
            <Input type="number" value={member.participationRate} onChange={(e) => update("participationRate", Number(e.target.value))} />
          </div>
        </div>
        <div className="space-y-1">
          <Label>경력사항</Label>
          <Textarea
            rows={3}
            placeholder="주요 프로젝트, 논문, 수상 경력 등"
            value={member.experience}
            onChange={(e) => update("experience", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function TeamPage() {
  const { currentProposal, updateSection, saveProposal } = useProposalStore();
  const team = currentProposal?.sections.team;
  const { text: aiText, isStreaming, startStream } = useAiStream();

  const [leadResearcher, setLeadResearcher] = useState<TeamMember>(
    team?.leadResearcher || createDefaultTeamMember("lead")
  );
  const [coResearchers, setCoResearchers] = useState<TeamMember[]>(
    team?.coResearchers || []
  );
  const [participants, setParticipants] = useState<TeamMember[]>(
    team?.participants || []
  );

  const handleSave = useCallback(() => {
    updateSection("team", {
      leadResearcher,
      coResearchers,
      participants,
      externalAdvisors: team?.externalAdvisors || [],
    });
    saveProposal();
    toast.success("연구팀 구성이 저장되었습니다.");
  }, [leadResearcher, coResearchers, participants, team, updateSection, saveProposal]);

  const handleAiGenerate = () => {
    startStream("/api/ai/generate", {
      sectionId: "team",
      proposalContext: currentProposal?.sections || {},
      language: "ko",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="연구팀 구성"
        description="책임연구원, 공동연구원, 참여연구원 프로필을 작성합니다."
      />

      <div className="flex gap-2">
        <AiGenerateButton onClick={handleAiGenerate} isLoading={isStreaming} />
      </div>

      <AiStreamingText text={aiText} isStreaming={isStreaming} />

      {/* 책임연구원 */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">책임연구원</h3>
        <TeamMemberEditor
          member={leadResearcher}
          onChange={setLeadResearcher}
          removable={false}
        />
      </div>

      <Separator />

      {/* 공동연구원 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">공동연구원</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCoResearchers([...coResearchers, createDefaultTeamMember("co_researcher")])}
          >
            <Plus className="mr-1 size-4" />
            추가
          </Button>
        </div>
        {coResearchers.map((member, i) => (
          <TeamMemberEditor
            key={member.id}
            member={member}
            onChange={(updated) => {
              const next = [...coResearchers];
              next[i] = updated;
              setCoResearchers(next);
            }}
            onRemove={() => setCoResearchers(coResearchers.filter((_, j) => j !== i))}
          />
        ))}
      </div>

      <Separator />

      {/* 참여연구원 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">참여연구원</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setParticipants([...participants, createDefaultTeamMember("participant")])}
          >
            <Plus className="mr-1 size-4" />
            추가
          </Button>
        </div>
        {participants.map((member, i) => (
          <TeamMemberEditor
            key={member.id}
            member={member}
            onChange={(updated) => {
              const next = [...participants];
              next[i] = updated;
              setParticipants(next);
            }}
            onRemove={() => setParticipants(participants.filter((_, j) => j !== i))}
          />
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={handleSave}>저장</Button>
      </div>
    </div>
  );
}
