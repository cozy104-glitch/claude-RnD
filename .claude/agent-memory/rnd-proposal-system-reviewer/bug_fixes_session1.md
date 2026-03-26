---
name: Bug Fixes Session 1 (2026-03-26)
description: 첫 전체 리뷰에서 발견·수정한 버그 목록과 핵심 패턴
type: project
---

## 수정된 버그 목록

### 1. sectionId vs URL href 불일치 (Critical)
- **위치**: `/lib/constants.ts`, `/store/proposal-store.ts`, `/components/layout/proposal-sidebar.tsx`
- **증상**: 선행연구 섹션의 `sectionMeta` 진행률이 영구적으로 0% — ID 불일치로 meta 매핑 실패
- **원인**: `proposalSections`의 `href: "prior-research"` (kebab)를 `ProposalSectionId`(`priorResearch` camelCase)로 캐스팅
- **수정**: `SidebarItem`에 `sectionId: ProposalSectionId` 필드 추가. href는 URL용, sectionId는 내부 상태용으로 분리
- **패턴**: URL 경로(kebab-case)와 TypeScript 타입 식별자(camelCase)는 반드시 분리 관리

### 2. useAutoSave의 unstable saveFn deps (High)
- **위치**: `/hooks/use-auto-save.ts`, 모든 섹션 페이지
- **증상**: 3초 딜레이 자동저장이 즉시 실행됨
- **원인**: `useEffect` deps에 `saveFn` 포함 + `saveFn`이 `watchedValues`에 의존하는 `useCallback`으로 생성되어 매 입력마다 재생성
- **수정**: `saveFnRef`로 최신 함수 추적, `useEffect` deps에서 `saveFn` 제거. 섹션 페이지에서 `useCallback` 제거

### 3. loadProposalList 빈 구현 (Medium)
- **위치**: `/store/proposal-store.ts`
- **원인**: `persist` 미들웨어가 자동 복원하므로 실제로 불필요한 함수
- **수정**: 인터페이스와 구현 모두 제거 (주석으로 이유 명시)

### 4. BudgetPage 자동저장 누락 (High)
- **위치**: `/app/proposals/[id]/budget/page.tsx`
- **증상**: 인건비/장비비 입력 후 다른 섹션으로 이동하면 데이터 손실
- **수정**: `useAutoSave` 추가, `directCosts`를 `useMemo`로 안정화

### 5. useAiStream 에러 응답 파싱 실패 (Medium)
- **위치**: `/hooks/use-ai-stream.ts`
- **증상**: 서버 에러 응답이 text/plain일 때 `response.json()` 실패로 미처리 예외 발생
- **수정**: Content-Type 확인 후 JSON/text 분기 처리

### 6. summary 최대 길이 불일치 (Medium)
- **위치**: `/lib/validations/proposal.ts`, `/app/proposals/[id]/overview/page.tsx`
- **수정**: 스키마와 UI 라벨 모두 300자로 통일

### 7. ImplementationPage early return으로 저장 불가 (Medium)
- **위치**: `/app/proposals/[id]/implementation/page.tsx`
- **증상**: implementation이 null이면 handleSave가 early return하여 저장 안 됨
- **수정**: 기본값(`[]`)으로 대체하여 항상 저장 가능하도록 수정

## 알려진 미구현 기능 (버그 아님)
- Stage 2: 공고문 파싱 (미구현)
- Stage 3: NTIS/IRIS 유사과제 검색 (미구현)
- Stage 4: 성공요인 적용 (미구현)
- 간트차트 시각화 (implementation 페이지에 Callout으로 안내)
- PDF 내보내기 (preview 페이지에 Callout으로 안내)

**Why:** 2026-03-26 첫 전체 리뷰. TypeScript 컴파일 및 next build 모두 오류 없이 통과 확인.
**How to apply:** 다음 리뷰 시 이 버그들이 재발했는지 확인하는 기준으로 활용.
