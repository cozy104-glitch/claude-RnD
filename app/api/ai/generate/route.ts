import { apiError } from "@/lib/api-response";
import { systemPrompt } from "@/lib/prompts/system-prompt";
import { sectionPrompts } from "@/lib/prompts/section-prompts";
import type { AiGenerateRequestDto } from "@/lib/types/ai";
import type { ProposalSectionId } from "@/lib/types/proposal";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return apiError("ANTHROPIC_API_KEY가 설정되지 않았습니다.", 500);
    }

    const body = (await request.json()) as AiGenerateRequestDto;
    const { sectionId, proposalContext, userPrompt } = body;

    // 섹션별 프롬프트 조합
    const sectionPrompt = sectionPrompts[sectionId as ProposalSectionId];
    if (!sectionPrompt) {
      return apiError("유효하지 않은 섹션입니다.", 400);
    }

    // 이미 작성된 다른 섹션 컨텍스트 구성
    const contextStr = proposalContext
      ? `\n\n## 참고: 이미 작성된 다른 섹션 정보\n${JSON.stringify(proposalContext, null, 2)}`
      : "";

    const userMessage = `${sectionPrompt}${contextStr}${userPrompt ? `\n\n## 추가 지시사항\n${userPrompt}` : ""}`;

    // Anthropic API 직접 호출 (스트리밍)
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
        stream: true,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return apiError(`API 호출 실패: ${error}`, response.status);
    }

    // SSE 스트림을 텍스트 스트림으로 변환
    const reader = response.body?.getReader();
    if (!reader) {
      return apiError("스트리밍을 시작할 수 없습니다.", 500);
    }

    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                    controller.enqueue(new TextEncoder().encode(parsed.delta.text));
                  }
                } catch {
                  // JSON 파싱 실패 시 무시
                }
              }
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("AI generate error:", error);
    return apiError("AI 초안 생성 중 오류가 발생했습니다.", 500);
  }
}
