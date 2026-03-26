import { apiError, apiSuccess } from "@/lib/api-response";
import { systemPrompt } from "@/lib/prompts/system-prompt";
import { reviewPrompt } from "@/lib/prompts/review-prompts";
import type { AiReviewRequestDto } from "@/lib/types/ai";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return apiError("ANTHROPIC_API_KEY가 설정되지 않았습니다.", 500);
    }

    const body = (await request.json()) as AiReviewRequestDto;
    const { sectionId, content, proposalContext } = body;

    const userMessage = `${reviewPrompt}\n\n## 검토 대상 섹션: ${sectionId}\n\n${content}\n\n## 참고: 다른 섹션 정보\n${JSON.stringify(proposalContext, null, 2)}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return apiError(`API 호출 실패: ${error}`, response.status);
    }

    const result = await response.json();
    const textContent = result.content?.[0]?.text || "";

    // JSON 응답 파싱 시도
    try {
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const reviewData = JSON.parse(jsonMatch[0]);
        return apiSuccess(reviewData);
      }
    } catch {
      // JSON 파싱 실패 시 텍스트 그대로 반환
    }

    return apiSuccess({ rawText: textContent });
  } catch (error) {
    console.error("AI review error:", error);
    return apiError("AI 검토 중 오류가 발생했습니다.", 500);
  }
}
