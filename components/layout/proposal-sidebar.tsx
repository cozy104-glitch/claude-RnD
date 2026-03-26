"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { proposalSections } from "@/lib/constants";
import type { ProposalSectionMeta } from "@/lib/types/proposal";

interface ProposalSidebarProps {
  proposalId: string;
  sectionMeta: ProposalSectionMeta[];
}

// 제안서 편집 사이드바 내부 컨텐츠
function SidebarContent({ proposalId, sectionMeta }: ProposalSidebarProps) {
  const pathname = usePathname();

  // 전체 진행률 계산
  const totalCompletion = sectionMeta.length > 0
    ? Math.round(
        sectionMeta.reduce((sum, m) => sum + m.completionRate, 0) /
        sectionMeta.length
      )
    : 0;

  return (
    <div className="flex h-full flex-col">
      {/* 전체 진행률 */}
      <div className="border-b p-4 space-y-2">
        <Link
          href={`/proposals/${proposalId}`}
          className="flex items-center gap-2 font-semibold hover:underline"
        >
          <LayoutDashboard className="size-4" />
          제안서 대시보드
        </Link>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>전체 진행률</span>
            <span>{totalCompletion}%</span>
          </div>
          <Progress value={totalCompletion} className="h-2" />
        </div>
      </div>

      {/* 섹션 목록 */}
      <ScrollArea className="flex-1 p-2">
        <nav className="space-y-1">
          {proposalSections.map((section) => {
            const meta = sectionMeta.find((m) => m.id === section.href);
            const href = `/proposals/${proposalId}/${section.href}`;
            const isActive = pathname === href;

            return (
              <Link
                key={section.href}
                href={href}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <span>{section.title}</span>
                {meta && meta.completionRate > 0 && (
                  <span className="text-xs tabular-nums">
                    {meta.completionRate}%
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* 미리보기 링크 */}
      <div className="border-t p-4">
        <Link
          href={`/proposals/${proposalId}/preview`}
          className="block text-center text-sm font-medium text-primary hover:underline"
        >
          전체 미리보기
        </Link>
      </div>
    </div>
  );
}

// 데스크탑 사이드바
export function ProposalSidebar(props: ProposalSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 border-r md:block">
      <SidebarContent {...props} />
    </aside>
  );
}

// 모바일 사이드바
export function MobileProposalSidebar(props: ProposalSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SidebarContent {...props} />
      </SheetContent>
    </Sheet>
  );
}
