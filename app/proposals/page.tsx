"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ProposalCard } from "@/components/proposal/proposal-card";
import { useProposalStore } from "@/store/proposal-store";
import { useState } from "react";

export default function ProposalsPage() {
  const { proposals, deleteProposal } = useProposalStore();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteTarget) {
      deleteProposal(deleteTarget);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="제안서 관리"
        description="작성 중인 R&D 제안서를 관리합니다."
        action={
          <Button asChild>
            <Link href="/proposals/new">
              <Plus className="mr-2 size-4" />
              새 제안서
            </Link>
          </Button>
        }
      />

      {proposals.length === 0 ? (
        <EmptyState
          title="아직 제안서가 없습니다"
          description="새 제안서를 만들어 R&D 과제 제안서 작성을 시작하세요."
          action={
            <Button asChild>
              <Link href="/proposals/new">새 제안서 작성</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onDelete={(id) => setDeleteTarget(id)}
            />
          ))}
        </div>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>제안서 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 제안서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
