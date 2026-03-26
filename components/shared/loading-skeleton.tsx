import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  variant?: "card" | "table" | "text";
  count?: number;
  className?: string;
}

// 다양한 로딩 스켈레톤 패턴 — variant로 형태 선택
export function LoadingSkeleton({
  variant = "text",
  count = 3,
  className,
}: LoadingSkeletonProps) {
  if (variant === "card") {
    return (
      <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-lg border p-6 space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={cn("rounded-lg border", className)}>
        {/* 테이블 헤더 */}
        <div className="border-b p-4 flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        {/* 테이블 행 */}
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="border-b last:border-0 p-4 flex gap-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // variant === "text"
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={cn("h-4", i === count - 1 ? "w-3/4" : "w-full")} />
      ))}
    </div>
  );
}
