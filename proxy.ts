import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 Proxy — 기본 보안 헤더 설정
// Next.js 16부터 middleware.ts 대신 proxy.ts / export function proxy() 사용
export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // 기본 보안 헤더
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // 요청 경로 추적 헤더
  response.headers.set("X-Pathname", request.nextUrl.pathname);

  return response;
}

export const config = {
  matcher: [
    // 정적 파일, _next 내부 경로 제외
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
