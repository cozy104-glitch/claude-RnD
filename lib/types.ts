import type { ComponentType, ReactNode } from "react";

// 네비게이션 아이템 타입 (layout 컴포넌트에서 참조)
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

// 데이터 테이블 컬럼 정의
export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
}

// 빈 상태 Props
export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

// 폼 필드 공통 Props
export interface FormFieldProps {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
}

// 브레드크럼 아이템
export interface BreadcrumbItemData {
  label: string;
  href?: string;
}
