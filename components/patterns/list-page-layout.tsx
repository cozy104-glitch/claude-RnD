import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";

interface BreadcrumbItemData {
  label: string;
  href?: string;
}

interface ListPageLayoutProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItemData[];
  action?: React.ReactNode;
  filters?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// 리스트 페이지 레이아웃 — PageHeader + 필터/검색 + 데이터 영역 조합
export function ListPageLayout({
  title,
  description,
  breadcrumbs,
  action,
  filters,
  children,
  className,
}: ListPageLayoutProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        action={action}
      />

      {filters && (
        <div className="flex flex-wrap items-center gap-2">{filters}</div>
      )}

      {children}
    </div>
  );
}
