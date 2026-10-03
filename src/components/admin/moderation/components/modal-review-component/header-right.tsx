import { formatSectionDuration } from "@/lib/utils";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { CourseValidationReport } from "../../moderation.types"
import { Badge } from "@/components/ui/badge";

export default function HeaderRight({
    report,
    setActiveTab
}: {
    report: CourseValidationReport,
    setActiveTab: (tab: "audit" | "content") => void
}) {
    const { summary, isValid, errors } = report;
    
    return (
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <div className="hidden sm:flex items-center gap-3 pr-2 border-r border-border text-xs text-muted-foreground">
                <span><b>{summary.totalSections}</b> chương • <b>{summary.totalLessons}</b> bài</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {formatSectionDuration(summary.totalVideoDuration)}
                </span>
            </div>

            {isValid ? (
                <Badge
                    variant="outline"
                    className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 gap-1.5 text-xs py-1 px-2.5 font-medium"
                >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Đạt chuẩn kỹ thuật (100%)
                </Badge>
            ) : (
                <Badge
                    variant="outline"
                    className="bg-rose-500/10 text-rose-600 border-rose-500/30 gap-1.5 text-xs py-1 px-2.5 font-medium cursor-pointer hover:bg-rose-500/20 transition-colors"
                    onClick={() => setActiveTab("audit")}
                >
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.length} lỗi kỹ thuật
                </Badge>
            )}
        </div>
    )
}