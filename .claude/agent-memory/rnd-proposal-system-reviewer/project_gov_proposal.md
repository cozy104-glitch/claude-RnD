---
name: Project Overview - gov-proposal-writer
description: 정부 R&D 제안서 AI 작성 보조 도구 전체 구조 및 데이터 흐름
type: project
---

Next.js 16 + TypeScript + Zustand + Zod + react-hook-form + shadcn/ui 스택.

## 파이프라인 구조 (5단계)

1. **사용자 방향성 수집 (Stage 1)**: `/proposals/new` → `createProposalSchema` 검증 → `useProposalStore.createProposal()`
2. **공고문 분석 (Stage 2)**: 현재 미구현 (각 섹션 폼에서 직접 입력하는 방식)
3. **유사과제 검색 (Stage 3)**: 현재 미구현 (NTIS/IRIS 연동 없음)
4. **성공요인 적용 (Stage 4)**: 현재 미구현
5. **항목별 제안서 작성 (Stage 5)**: `/proposals/[id]/[section]` 8개 섹션 페이지에서 AI 초안 생성 (`/api/ai/generate` SSE 스트리밍)

## 핵심 데이터 흐름

- `ProposalStore` (Zustand + localStorage persist): 모든 제안서 상태의 단일 진실 공급원
- `sections.priorResearch` ↔ URL `/prior-research` (kebab) vs sectionId `priorResearch` (camelCase) 분리 관리 필요
- AI 생성: Anthropic API 직접 호출 (SSE 스트리밍), 모델 `claude-sonnet-4-20250514`
- AI 검토: 동일 API 비스트리밍, JSON 파싱 후 `AiReviewResponseDto` 반환

## 주요 파일 경로

- 스토어: `/store/proposal-store.ts`
- 타입: `/lib/types/proposal.ts`, `/lib/types/budget.ts`, `/lib/types/ai.ts`
- 섹션 상수: `/lib/constants.ts` — `SidebarItem`에 `href`(URL용)와 `sectionId`(camelCase) 분리
- AI API 라우트: `/app/api/ai/{generate,review,complete}/route.ts`
- 예산 계산: `/lib/budget/calculator.ts`
- 자동저장: `/hooks/use-auto-save.ts` (ref 패턴으로 unstable deps 방지)
- Next.js 16 Proxy: `/proxy.ts` (함수명 `proxy`, `middleware.ts` 아님)

**Why:** 2026-03-26 첫 리뷰에서 확인한 현재 구조. Stage 2~4는 미구현 상태.
**How to apply:** 향후 NTIS/IRIS 연동 구현 시 이 파이프라인 단계를 참조.
