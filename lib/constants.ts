import type { ComponentType } from "react";

// 네비게이션 아이템 타입
export interface NavItem {
  title: string;
  href: string;
  description?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: ComponentType<{ className?: string }>;
}

// 사이드바 아이템 타입
export interface SidebarItem extends NavItem {
  badge?: string;
}

// 메인 네비게이션
export const mainNavItems: NavItem[] = [
  { title: "홈", href: "/" },
  { title: "제안서 관리", href: "/proposals" },
  { title: "설정", href: "/settings" },
];

// 제안서 섹션 정의
export const proposalSections: SidebarItem[] = [
  { title: "제안서 개요", href: "overview", description: "연구개요 작성" },
  { title: "연구목표", href: "objectives", description: "최종목표 및 연차별 목표" },
  { title: "연구내용", href: "content", description: "연구범위, 방법, 전략" },
  { title: "추진체계", href: "implementation", description: "추진일정 및 역할분담" },
  { title: "연구팀 구성", href: "team", description: "연구원 프로필" },
  { title: "연구예산", href: "budget", description: "예산 편성 및 자동계산" },
  { title: "기대효과", href: "impact", description: "기대효과 및 활용방안" },
  { title: "선행연구", href: "prior-research", description: "국내외 연구동향" },
];

// 푸터 링크
export const footerLinks = {
  resources: [
    { title: "NTIS", href: "https://www.ntis.go.kr", external: true },
    { title: "IITP", href: "https://www.iitp.kr", external: true },
    { title: "NRF", href: "https://www.nrf.re.kr", external: true },
  ],
};
