"use client";

import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AiGenerateButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
}

// AI 초안 생성 버튼
export function AiGenerateButton({
  onClick,
  isLoading = false,
  disabled = false,
  label = "AI 초안 생성",
}: AiGenerateButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={isLoading || disabled}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Sparkles className="size-4" />
      )}
      {isLoading ? "생성 중..." : label}
    </Button>
  );
}
