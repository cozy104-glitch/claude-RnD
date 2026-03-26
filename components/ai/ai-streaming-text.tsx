"use client";

import { Loader2 } from "lucide-react";

interface AiStreamingTextProps {
  text: string;
  isStreaming: boolean;
}

// AI 스트리밍 텍스트 표시 컴포넌트
export function AiStreamingText({ text, isStreaming }: AiStreamingTextProps) {
  if (!text && !isStreaming) return null;

  return (
    <div className="rounded-md border bg-muted/50 p-4">
      <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
        {text}
        {isStreaming && (
          <span className="inline-flex items-center gap-1 ml-1">
            <Loader2 className="size-3 animate-spin" />
          </span>
        )}
      </div>
    </div>
  );
}
