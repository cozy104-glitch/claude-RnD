"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Callout } from "@/components/shared/callout";

// 설정 페이지
export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <PageHeader
        title="설정"
        description="API 키 및 환경 설정을 관리합니다."
      />

      <div className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Anthropic API 키</CardTitle>
            <CardDescription>
              AI 기능을 사용하려면 Anthropic API 키가 필요합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Callout variant="info" title="환경 변수 설정">
              프로젝트 루트에 <code>.env.local</code> 파일을 생성하고
              <code>ANTHROPIC_API_KEY=sk-ant-...</code>를 추가하세요.
              보안을 위해 API 키는 서버 측 환경 변수로만 관리됩니다.
            </Callout>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>데이터 저장</CardTitle>
            <CardDescription>
              현재 모든 제안서 데이터는 브라우저 localStorage에 저장됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Callout variant="warning" title="주의">
              브라우저 데이터를 삭제하면 제안서 데이터도 함께 삭제됩니다.
              중요한 데이터는 미리보기 페이지에서 백업하세요.
            </Callout>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
