"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SettingsNavItem {
  title: string;
  href: string;
}

interface SettingsLayoutProps {
  navItems: SettingsNavItem[];
  children: React.ReactNode;
  className?: string;
}

// 설정 레이아웃 — 좌측 세로 탭 + 컨텐츠 패널
export function SettingsLayout({
  navItems,
  children,
  className,
}: SettingsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col gap-6 md:flex-row", className)}>
      {/* 좌측 탭 네비게이션 */}
      <nav className="flex md:w-48 md:shrink-0 md:flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>

      {/* 컨텐츠 영역 */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
