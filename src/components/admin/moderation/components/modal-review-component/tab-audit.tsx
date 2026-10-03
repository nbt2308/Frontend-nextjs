import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileCheck2, AlertCircle, CheckCircle2 } from "lucide-react";
import { CourseValidationReport } from "../../moderation.types";

export default function TabAudit({
    report,
    filterFailedOnly,
    setFilterFailedOnly
}: {
    report: CourseValidationReport;
    filterFailedOnly: boolean;
    setFilterFailedOnly: (val: boolean) => void;
}) {
    const { isValid, errors, summary } = report;

    return (
        <TabsContent
            value="audit"
            className="flex-1 overflow-y-auto p-6 m-0 space-y-6 focus-visible:outline-none"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 mb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <FileCheck2 className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-bold text-foreground">
                            Kết quả kiểm duyệt tự động
                        </h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Kết quả đánh giá từ hệ thống kiểm duyệt
                    </p>
                </div>
                <Badge
                    className={`font-semibold text-xs ${
                        isValid
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-rose-600 text-white hover:bg-rose-700"
                    }`}
                >
                    {isValid ? "ĐẠT CHUẨN XUẤT BẢN" : `CHƯA ĐẠT – ${errors.length} LỖI`}
                </Badge>
            </div>

            {/* Error list or success state */}
            {isValid ? (
                <div className="p-8 text-center border rounded-lg border-dashed border-emerald-300 bg-emerald-500/5">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                        Khóa học đạt toàn bộ tiêu chuẩn kỹ thuật
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Không có lỗi nào được phát hiện. Khóa học sẵn sàng để phê duyệt.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {errors.map((error, index) => (
                        <div
                            key={`${error.code}-${index}`}
                            className="p-3.5 rounded-lg border border-rose-500/30 bg-rose-500/5 text-xs"
                        >
                            <div className="flex items-start gap-2.5">
                                <div className="p-1 rounded-full shrink-0 mt-0.5 bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-semibold text-rose-900 dark:text-rose-200">
                                            {error.message}
                                        </span>
                                        <span className="text-[10px] font-mono text-muted-foreground shrink-0 bg-muted px-1.5 py-0.5 rounded">
                                            {error.code}
                                        </span>
                                    </div>
                                    {/* Extra context */}
                                    <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                                        {error.sectionTitle && (
                                            <span>Chương: <b>{error.sectionTitle}</b></span>
                                        )}
                                        {error.lessonTitle && (
                                            <span>Bài: <b>{error.lessonTitle}</b></span>
                                        )}
                                        {error.resourceName && (
                                            <span>Tài nguyên: <b>{error.resourceName}</b></span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Aggregates Summary box */}
            <div className="p-4 border rounded-lg bg-muted/20 mt-4 text-xs text-muted-foreground">
                <h4 className="font-semibold text-foreground mb-3">Thông số thống kê nhanh</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px]">
                    <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Chương</span>
                        <span className="text-sm"><b className="text-foreground">{summary.totalSections}</b> (tối thiểu 1)</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Bài giảng</span>
                        <span className="text-sm"><b className="text-foreground">{summary.totalLessons}</b> (tối thiểu 5)</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Thời lượng Video của khóa học</span>
                        <span className="text-sm"><b className="text-foreground">{Math.floor(summary.totalVideoDuration / 60)} phút</b> (tối thiểu 30p)</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Tài nguyên</span>
                        <span className="text-sm"><b className="text-foreground">{summary.totalResources} tệp</b> đính kèm</span>
                    </div>
                </div>
            </div>
        </TabsContent>
    );
}
