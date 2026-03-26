import { Info, AlertTriangle, XCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface CalloutProps {
  variant?: "info" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

// variant별 아이콘 매핑
const variantConfig = {
  info: {
    icon: Info,
    alertVariant: "default" as const,
  },
  warning: {
    icon: AlertTriangle,
    alertVariant: "default" as const,
  },
  error: {
    icon: XCircle,
    alertVariant: "destructive" as const,
  },
};

// 정보 블록 — Alert 기반, 안내/경고/에러 메시지 표시에 사용
export function Callout({
  variant = "info",
  title,
  children,
  className,
}: CalloutProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Alert variant={config.alertVariant} className={cn(className)}>
      <Icon className="size-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
