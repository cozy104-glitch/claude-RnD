// 표준 API 응답 헬퍼 — 일관된 Response Body 구조 유지

interface ApiResponse<T = unknown> {
  status: "success" | "error";
  message: string;
  data: T | null;
}

// 성공 응답 생성
export function apiSuccess<T>(data: T, message = "요청이 성공했습니다") {
  const body: ApiResponse<T> = {
    status: "success",
    message,
    data,
  };
  return Response.json(body, { status: 200 });
}

// 에러 응답 생성
export function apiError(
  message: string,
  statusCode = 400,
  data: unknown = null
) {
  const body: ApiResponse = {
    status: "error",
    message,
    data,
  };
  return Response.json(body, { status: statusCode });
}

// 404 응답
export function apiNotFound(message = "리소스를 찾을 수 없습니다") {
  return apiError(message, 404);
}

// 500 응답
export function apiServerError(message = "서버 내부 오류가 발생했습니다") {
  return apiError(message, 500);
}
