"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import {
  createProposalSchema,
  type CreateProposalFormValues,
} from "@/lib/validations/proposal";
import { useProposalStore } from "@/store/proposal-store";

export default function NewProposalPage() {
  const router = useRouter();
  const { createProposal } = useProposalStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProposalFormValues>({
    resolver: zodResolver(createProposalSchema),
    defaultValues: { title: "", programName: "" },
  });

  const onSubmit = (data: CreateProposalFormValues) => {
    const id = createProposal(data.title, data.programName);
    toast.success("새 제안서가 생성되었습니다.");
    router.push(`/proposals/${id}`);
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <PageHeader
        title="새 제안서 작성"
        description="새로운 R&D 과제 제안서의 기본 정보를 입력하세요."
        breadcrumbs={[
          { label: "제안서 관리", href: "/proposals" },
          { label: "새 제안서" },
        ]}
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
          <CardDescription>
            과제명과 사업명을 입력하면 제안서 편집을 시작할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">과제명</Label>
              <Input
                id="title"
                placeholder="예: AI 기반 신용평가 고도화 기술 개발"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="programName">사업명</Label>
              <Input
                id="programName"
                placeholder="예: 정보통신방송 기술개발사업"
                {...register("programName")}
              />
              {errors.programName && (
                <p className="text-sm text-destructive">{errors.programName.message}</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting}>
                제안서 생성
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
