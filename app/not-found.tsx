import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorLayout } from "@/components/patterns/error-layout";

export default function NotFound() {
  return (
    <ErrorLayout
      icon={<FileQuestion className="size-8 text-muted-foreground" />}
      title="페이지를 찾을 수 없습니다"
      description="요청하신 페이지가 존재하지 않습니다."
      action={
        <Button asChild>
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      }
    />
  );
}
