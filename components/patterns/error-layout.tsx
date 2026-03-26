import { cn } from "@/lib/utils";

interface ErrorLayoutProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

// 에러 레이아웃 — 중앙 정렬 아이콘 + 메시지 + 액션 버튼 패턴
export function ErrorLayout({
  icon,
  title,
  description,
  action,
  className,
}: ErrorLayoutProps) {
  return (
    <div
      className={cn(
        "flex min-h-[50vh] flex-col items-center justify-center gap-4 p-4 text-center",
        className
      )}
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && (
          <p className="text-muted-foreground max-w-md">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
