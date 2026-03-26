import Link from "next/link";
import { FileText, Sparkles, Download, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// 주요 기능 목록
const features = [
  {
    icon: FileText,
    title: "섹션별 구조화 편집",
    description: "연구개요, 목표, 내용, 추진체계, 예산 등 8개 섹션을 체계적으로 작성합니다.",
  },
  {
    icon: Sparkles,
    title: "AI 초안 생성 & 검토",
    description: "Claude AI가 섹션별 초안을 생성하고, 작성된 내용을 평가위원 관점에서 검토합니다.",
  },
  {
    icon: Calculator,
    title: "예산 자동 계산",
    description: "인건비, 장비비, 재료비 등을 입력하면 직접비/간접비가 자동으로 계산됩니다.",
  },
  {
    icon: Download,
    title: "PDF 내보내기",
    description: "완성된 제안서를 정부 양식에 맞춘 PDF 문서로 바로 내보낼 수 있습니다.",
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero 섹션 */}
      <section className="flex flex-col items-center text-center space-y-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          정부 R&D 제안서
          <br />
          <span className="text-primary">AI 작성 보조 도구</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          IITP, NRF, KIAT 등 정부지원사업 R&D 제안서를 AI와 함께 체계적으로 작성하세요.
          섹션별 구조화 편집, AI 초안 생성, 예산 자동 계산을 지원합니다.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/proposals">제안서 관리</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/proposals/new">새 제안서 작성</Link>
          </Button>
        </div>
      </section>

      {/* 주요 기능 */}
      <section className="py-12">
        <h2 className="mb-8 text-center text-2xl font-bold">주요 기능</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center">
              <CardHeader>
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="size-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
