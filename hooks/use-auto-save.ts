"use client";

import { useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/use-debounce";

// 자동저장 훅: 데이터 변경 후 delay(ms) 후 자동 저장
export function useAutoSave(
  data: unknown,
  saveFn: () => void,
  delay = 3000
) {
  const debouncedData = useDebounce(data, delay);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // 첫 렌더링 시에는 저장하지 않음
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveFn();
  }, [debouncedData, saveFn]);
}
