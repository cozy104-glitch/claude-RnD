"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorLayout } from "@/components/patterns/error-layout";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Root error:", error);
  }, [error]);

  return (
    <ErrorLayout
      icon={<AlertCircle className="size-8 text-destructive" />}
      title="오류가 발생했습니다"
      description="페이지를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요."
      action={
        <Button onClick={unstable_retry}>다시 시도</Button>
      }
    />
  );
}
