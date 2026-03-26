"use client";

import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { AiReviewResponseDto } from "@/lib/types/ai";
import { aiCategoryLabels } from "@/lib/types/ai";

interface AiReviewPanelProps {
  review: AiReviewResponseDto | null;
  onClose: () => void;
  onApplySuggestion?: (suggestedText: string) => void;
}

// AI 검토 결과 패널
export function AiReviewPanel({ review, onClose, onApplySuggestion }: AiReviewPanelProps) {
  if (!review) return null;

  return (
    <Card className="border-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">AI 검토 결과</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={review.overallScore >= 7 ? "default" : "secondary"}>
            {review.overallScore}/10점
          </Badge>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 강점 */}
        {review.strengths.length > 0 && (
          <div className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-sm font-medium text-green-600">
              <CheckCircle2 className="size-4" />
              강점
            </h4>
            <ul className="space-y-1 pl-6 text-sm text-muted-foreground">
              {review.strengths.map((s, i) => (
                <li key={i} className="list-disc">{s}</li>
              ))}
            </ul>
          </div>
        )}

        {review.strengths.length > 0 && review.improvements.length > 0 && (
          <Separator />
        )}

        {/* 개선점 */}
        {review.improvements.length > 0 && (
          <div className="space-y-3">
            <h4 className="flex items-center gap-1.5 text-sm font-medium text-amber-600">
              <AlertCircle className="size-4" />
              개선 제안
            </h4>
            {review.improvements.map((imp, i) => (
              <div key={i} className="rounded-md border p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {aiCategoryLabels[imp.category]}
                  </Badge>
                </div>
                <p className="text-sm">{imp.description}</p>
                <p className="text-sm text-muted-foreground">{imp.suggestion}</p>
                {imp.suggestedText && onApplySuggestion && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onApplySuggestion(imp.suggestedText!)}
                    className="text-xs"
                  >
                    제안 적용
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
