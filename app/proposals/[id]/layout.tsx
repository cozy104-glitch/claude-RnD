"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { ProposalSidebar, MobileProposalSidebar } from "@/components/layout/proposal-sidebar";
import { useProposalStore } from "@/store/proposal-store";

export default function ProposalEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const proposalId = params.id as string;
  const { currentProposal, loadProposal } = useProposalStore();

  useEffect(() => {
    if (!currentProposal || currentProposal.id !== proposalId) {
      loadProposal(proposalId);
    }
  }, [proposalId, currentProposal, loadProposal]);

  const sectionMeta = currentProposal?.sectionMeta ?? [];

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* 데스크탑 사이드바 */}
      <ProposalSidebar proposalId={proposalId} sectionMeta={sectionMeta} />

      {/* 메인 콘텐츠 */}
      <div className="flex-1">
        {/* 모바일 사이드바 토글 */}
        <div className="border-b px-4 py-2 md:hidden">
          <MobileProposalSidebar proposalId={proposalId} sectionMeta={sectionMeta} />
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
