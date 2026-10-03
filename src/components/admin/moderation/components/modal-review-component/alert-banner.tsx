import { Button } from "@/components/ui/button";
import { CourseValidationReport } from "../../moderation.types";
import { AlertCircle } from "lucide-react";

export default function AlertBanner({
    report,
    setActiveTab,
    isValid,
    errors,
}: {
    report: CourseValidationReport,
    setActiveTab: (tab: "audit" | "content") => void,
    isValid: boolean,
    errors: any[],
}) {
    return (
        <>
            {!isValid && (
                <div className="bg-rose-500/10 border-b border-rose-500/20 px-6 py-2.5 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 text-rose-700 dark:text-rose-300 min-w-0">
                        <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                        <span className="truncate">
                            <strong>Cảnh báo kiểm định hệ thống:</strong> Phát hiện {errors.length} lỗi kỹ thuật chưa đạt.
                        </span>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("audit")}
                        className="h-7 text-xs border-rose-300 text-rose-700 hover:bg-rose-100 shrink-0 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/50"
                    >
                        Xem chi tiết lỗi ({errors.length})
                    </Button>
                </div>
            )}
        </>
    )
}