"use client";

import { useSyncExternalStore } from "react";

// hydration 안전 훅 — 클라이언트 마운트 여부 확인
// useSyncExternalStore를 사용하여 SSR/CSR 경계를 안전하게 처리
const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function useMounted() {
  return useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
}
