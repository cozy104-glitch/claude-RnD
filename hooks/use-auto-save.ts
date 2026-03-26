"use client";

import { useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/use-debounce";

// 자동저장 훅: 데이터 변경 후 delay(ms) 후 자동 저장
// saveFn을 ref로 추적하여 deps에서 제외 — 매 렌더마다 재생성되는 함수로 인한
// 불필요한 useEffect 재실행을 방지하면서도 항상 최신 saveFn을 호출한다
export function useAutoSave(
  data: unknown,
  saveFn: () => void,
  delay = 3000
) {
  const debouncedData = useDebounce(data, delay);
  const isFirstRender = useRef(true);
  const saveFnRef = useRef(saveFn);

  // 렌더마다 최신 saveFn을 ref에 동기화
  saveFnRef.current = saveFn;

  useEffect(() => {
    // 첫 렌더링 시에는 저장하지 않음 (초기값 로드 시 불필요한 저장 방지)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // ref를 통해 최신 saveFn 호출 — debouncedData 변경 시에만 실행
    saveFnRef.current();
  }, [debouncedData]); // saveFn은 의도적으로 deps에서 제외 (ref로 관리)
}
