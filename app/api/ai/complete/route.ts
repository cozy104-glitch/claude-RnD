import { apiError } from "@/lib/api-response";
import { systemPrompt } from "@/lib/prompts/system-prompt";
import type { AiCompleteRequestDto } from "@/lib/types/ai";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return apiError("ANTHROPIC_API_KEY가 설정되지 않았습니다.", 500);
    }

    const body = (await request.json()) as AiCompleteRequestDto;
    const { sectionId, partialContent } = body;

    const userMessage = `정부 R&D 제안서의 "${sectionId}" 섹션에서 아래 텍스트를 이어서 자연스럽게 완성해주세요. 추가되는 내용만 출력하세요.\n\n---\n${partialContent}`;

    // 스트리밍 응답
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        stream: true,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return apiError(`API 호출 실패: ${error}`, response.status);
    }

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
                  // 파싱 실패 무시
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
    console.error("AI complete error:", error);
    return apiError("AI 자동완성 중 오류가 발생했습니다.", 500);
  }
}
