import { z } from "zod";

// 공통 검증 스키마
export const requiredString = z
  .string()
  .min(1, "필수 입력 항목입니다");

export const koreanName = z
  .string()
  .min(2, "이름은 최소 2자 이상이어야 합니다")
  .max(50, "이름은 최대 50자까지 입력할 수 있습니다");

export const positiveNumber = z
  .number()
  .min(0, "0 이상의 숫자를 입력해주세요");

export const percentageNumber = z
  .number()
  .min(0, "0 이상이어야 합니다")
  .max(100, "100 이하여야 합니다");

export const yearNumber = z
  .number()
  .int("정수를 입력해주세요")
  .min(1, "1 이상이어야 합니다")
  .max(10, "10 이하여야 합니다");

export const emailSchema = z
  .string()
  .email("올바른 이메일 형식이 아닙니다");

export const urlSchema = z
  .string()
  .url("올바른 URL 형식이 아닙니다")
  .or(z.literal(""));
