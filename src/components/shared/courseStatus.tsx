import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  FileEdit, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  EyeOff,
  type LucideIcon 
} from "lucide-react";
import { CourseStatus } from "@/types/generated-zod/schemas";

interface StatusConfig {
  label: string;
  className: string;
  icon: LucideIcon;
}

const STATUS_MAP: Record<CourseStatus, StatusConfig> = {
  DRAFT: {
    label: "Bản nháp",
    className: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100/80 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700",
    icon: FileEdit,
  },
  PENDING: {
    label: "Chờ duyệt",
    className: "bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-50/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60",
    icon: Clock,
  },
  PUBLISHED: {
    label: "Đã xuất bản",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-50/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Bị từ chối",
    className: "bg-rose-50 text-rose-700 border-rose-200/80 hover:bg-rose-50/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/60",
    icon: XCircle,
  },
  UNPUBLISHED: {
    label: "Tạm ẩn",
    className: "bg-purple-50 text-purple-700 border-purple-200/80 hover:bg-purple-50/80 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/60",
    icon: EyeOff,
  },
};

interface CourseStatusBadgeProps {
  status: CourseStatus;
  showIcon?: boolean;
  className?: string;
}

export const CourseStatusBadge: React.FC<CourseStatusBadgeProps> = ({
  status,
  showIcon = true,
  className = "",
}) => {
  const config = STATUS_MAP[status] || STATUS_MAP.DRAFT;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border transition-all duration-200 ${config.className} ${className}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{config.label}</span>
    </Badge>
  );
};