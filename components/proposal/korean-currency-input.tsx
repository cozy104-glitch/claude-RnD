"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/budget/calculator";

interface KoreanCurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// 원화 금액 입력 컴포넌트 (포맷팅 자동 적용)
export function KoreanCurrencyInput({
  value,
  onChange,
  placeholder = "0",
  className,
  disabled,
}: KoreanCurrencyInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, "");
      onChange(raw ? parseInt(raw, 10) : 0);
    },
    [onChange]
  );

  const displayValue = isFocused
    ? value === 0 ? "" : String(value)
    : value === 0 ? "" : formatNumber(value);

  return (
    <div className="relative">
      <Input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
      />
      {value > 0 && !isFocused && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          원
        </span>
      )}
    </div>
  );
}
