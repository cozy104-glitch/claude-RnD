import Link from "next/link";
import { Home, FileText, Settings } from "lucide-react";
import { siteConfig } from "@/config/site";
import { mainNavItems } from "@/lib/constants";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { SearchCommand } from "@/components/shared/search-command";

// 검색 팔레트에 표시할 페이지 목록
const searchItems = [
  { title: "홈", href: "/", description: "메인 페이지", icon: <Home className="size-4" /> },
  { title: "제안서 관리", href: "/proposals", description: "제안서 목록", icon: <FileText className="size-4" /> },
  { title: "설정", href: "/settings", description: "API 키 및 환경 설정", icon: <Settings className="size-4" /> },
];

// 반응형 헤더 — 데스크탑: 수평 메뉴, 모바일: 햄버거 Sheet
export function Header() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center px-4">
          {/* 모바일 햄버거 */}
          <MobileNav />

          {/* 사이트 로고 */}
          <Link href="/" className="mr-6 flex items-center gap-2 font-bold">
            {siteConfig.name}
          </Link>

          {/* 데스크탑 네비게이션 */}
          <DesktopNav items={mainNavItems} />

          {/* 우측 영역 */}
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Cmd+K 검색 팔레트 */}
      <SearchCommand items={searchItems} />
    </>
  );
}
