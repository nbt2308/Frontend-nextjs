"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    XCircle,
    BookOpen,
    User,
    FileCheck2,
    FileText,
    ShieldX,
} from "lucide-react";
import { ModerationCourse, ModerationLesson, ModerationSection } from "./moderation.types";
import { formatDate, formatSectionDuration } from "@/lib/utils";
import ModalVideoPreview from "../../shared/modal-video-preview";
import ModalRejectReason from "./modal-reject-reason";
import { toast } from "sonner";
import { CourseStatusBadge } from "@/components/shared/courseStatus";
import HeaderRight from "./components/modal-review-component/header-right";
import AlertBanner from "./components/modal-review-component/alert-banner";
import TabCurriculum from "./components/modal-review-component/tab-curriculum";
import TabInfo from "./components/modal-review-component/tab-info";
import TabInstructor from "./components/modal-review-component/tab-instructor";
import TabAudit from "./components/modal-review-component/tab-audit";
import TabReason from "./components/modal-review-component/tab-reason";
import { Loader2 } from "lucide-react";
import { useApproveCourse, useModerationReview } from "@/hooks/useCourse";
import { CourseStatusSchema } from "@/types/generated-zod/schemas";
import ModalValidationError from "@/components/shared/modal-validation-error";

interface ModalCourseReviewProps {
    open: boolean;
    onClose: () => void;
    courseId: string | null;
    onApprove: (courseId: string) => void;
    onReject: (courseId: string, reason: string) => void;
}

export default function ModalCourseReview({
    open,
    onClose,
    courseId,
    onApprove,
    onReject,
}: ModalCourseReviewProps) {
    const CourseStatus = CourseStatusSchema.enum;
    const [activeTab, setActiveTab] = useState("curriculum");
    const [selectedLessonForPreview, setSelectedLessonForPreview] = useState<ModerationLesson | null>(null);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [filterFailedOnly, setFilterFailedOnly] = useState(false);
    const [validationErrorModal, setValidationErrorModal] = useState(false);
    const { data: course, isLoading } = useModerationReview(open ? courseId || undefined : undefined);
    const { mutate: approveCourse, isPending: isApproveCoursePending } = useApproveCourse();
    if (!open) return null;

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogTitle className="hidden">Tiêu đề</DialogTitle>
                <DialogContent className="sm:max-w-md p-10 flex flex-col items-center justify-center min-h-[300px]">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground font-medium">Đang tải thông tin chi tiết khóa học...</p>
                </DialogContent>
            </Dialog>
        );
    }

    if (!course) return null;

    // Use validation data from backend API (no FE-side validation)
    const validationReport = course.validationSummary;
    const { isValid, summary, errors } = validationReport;



    const handleConfirmApprove = (id: string) => {
        approveCourse(id, {
            onSuccess: () => {
                onClose();
            },
            onError: () => {
                setValidationErrorModal(true);
            }
        });
    };


    const price = Number(course.price || 0);
    const discount = Number(course.discount || 0);
    const hasDiscount = course.courseType === "PAID" && discount > 0 && discount < price;
    let discountPercent = 0;
    if (hasDiscount) {
        discountPercent = Math.round(
            ((price - discount) / price) * 100
        );
    }
    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent
                    showCloseButton={true}
                    className="sm:max-w-6xl w-[96vw] max-h-[94vh] p-0 gap-0 overflow-hidden flex flex-col border-border/80 shadow-2xl bg-card text-card-foreground"
                >
                    {/* Top Header Banner */}
                    <DialogHeader className="px-6 py-4 border-b border-border bg-muted/40 shrink-0 text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <CourseStatusBadge status={course.status} />
                                    <Badge variant="secondary" className="text-xs">
                                        {course.category?.name}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs font-mono">
                                        ID: {course.id}
                                    </Badge>
                                </div>
                                <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground line-clamp-1">
                                    {course.title}
                                </DialogTitle>
                                <DialogDescription className="sr-only">
                                    Thẩm định chi tiết khóa học, kiểm tra bài giảng, giảng viên và tiêu chuẩn xuất bản.
                                </DialogDescription>
                            </div>

                            {/* Header right */}
                            <HeaderRight report={validationReport} setActiveTab={setActiveTab} />
                        </div>
                    </DialogHeader>
                    {/*Alert Banner: Only shows when there are errors / warnings */}
                    <AlertBanner report={validationReport} setActiveTab={setActiveTab} isValid={isValid} errors={errors} />

                    {/* Main Content: Full-width Tabs View */}
                    <div className="flex-1 overflow-hidden flex flex-col min-h-0 my-5">
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="flex-1 flex flex-col min-h-0"
                        >
                            <div className="px-6 shrink-0 flex items-center justify-between my-2 border-b border-border pb-2">
                                <TabsList className="bg-muted/60 p-1 rounded-xl h-11 flex gap-2">
                                    <TabsTrigger
                                        value="curriculum"
                                        className="text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs rounded-lg px-3"
                                    >
                                        <BookOpen className="h-4 w-4" />
                                        <span>Bài giảng & Video</span>
                                        <Badge variant="secondary" className="px-1.5 py-0 h-4 text-[10px]">
                                            {summary.totalLessons}
                                        </Badge>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="info"
                                        className="text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs rounded-lg px-3"
                                    >
                                        <FileText className="h-4 w-4" />
                                        <span>Thông tin chung</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="instructor"
                                        className="text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs rounded-lg px-3"
                                    >
                                        <User className="h-4 w-4" />
                                        <span>Giảng viên</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="audit"
                                        className={`text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs rounded-lg px-3 ${!isValid ? "text-rose-600 dark:text-rose-400" : ""
                                            }`}
                                    >
                                        <FileCheck2 className="h-4 w-4" />
                                        <span>Tiêu chuẩn kỹ thuật</span>
                                        <Badge
                                            variant={isValid ? "outline" : "destructive"}
                                            className="px-1.5 py-0 h-4 text-[10px]"
                                        >
                                            {isValid ? "Đạt" : `${errors.length} lỗi`}
                                        </Badge>
                                    </TabsTrigger>
                                    {course.reason_rejected && (
                                        <TabsTrigger
                                            value="reason"
                                            className="text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs rounded-lg px-3 text-rose-600 dark:text-rose-400"
                                        >
                                            <ShieldX className="h-4 w-4" />
                                            <span>Lý do từ chối</span>
                                        </TabsTrigger>
                                    )}
                                </TabsList>
                                <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                                    <Badge variant="outline" className="text-xs">
                                        {summary.totalPreviewLessons} bài học thử
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        {summary.totalResources} tài liệu đính kèm
                                    </Badge>
                                </div>
                            </div>

                            {/* TAB 1: CURRICULUM */}
                            <TabCurriculum
                                course={course}
                                summary={summary}
                                formatSectionDuration={formatSectionDuration}
                                setSelectedLessonForPreview={setSelectedLessonForPreview}
                                setPreviewModalOpen={setPreviewModalOpen}
                            />

                            {/* TAB 2: COURSE GENERAL INFO */}
                            <TabInfo
                                course={course}
                                price={price}
                                hasDiscount={hasDiscount}
                                discount={discount}
                                discountPercent={discountPercent}
                            />

                            {/* TAB 3: INSTRUCTOR INFO */}
                            <TabInstructor course={course} />

                            {/* TAB 4: AUDIT */}
                            <TabAudit
                                report={validationReport}
                                filterFailedOnly={filterFailedOnly}
                                setFilterFailedOnly={setFilterFailedOnly}
                            />

                            {/* TAB 5: REJECT REASON */}
                            <TabReason reasonRejected={course.reason_rejected} />
                        </Tabs>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="px-6 py-3.5 border-t border-border bg-muted/40 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Ngày gửi duyệt: <b>{formatDate(course.submittedAt)}</b></span>

                        </div>

                        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="text-xs h-9"
                            >
                                Đóng
                            </Button>
                            {
                                !course.reason_rejected && course.status === CourseStatus.PENDING && (
                                    <>
                                        {/* Nút Từ chối */}
                                        < Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setRejectModalOpen(true)}
                                            className="text-xs h-9 border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/40 gap-1.5"
                                        >
                                            <XCircle className="h-4 w-4" />
                                            Từ chối phê duyệt
                                        </Button>

                                        {/* Nút Phê duyệt */}
                                        <Button
                                            type="button"
                                            onClick={() => handleConfirmApprove(courseId ?? "")}
                                            disabled={isApproveCoursePending}
                                            className="text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 font-semibold shadow-xs"
                                        >
                                            {
                                                isApproveCoursePending ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Đang xử lý...
                                                    </>
                                                ) :
                                                    <>
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Phê duyệt khóa học
                                                    </>
                                            }

                                        </Button>
                                    </>
                                )
                            }

                        </div>
                    </div>
                </DialogContent>
            </Dialog >

            {/* Sub-Modal: Preview Video */}
            < ModalVideoPreview
                open={previewModalOpen}
                onClose={() => setPreviewModalOpen(false)
                }
                lesson={selectedLessonForPreview}
                courseTitle={course.title}
                sectionTitle={course.sections.find((s: ModerationSection) => s.lessons.some((l: ModerationLesson) => l.id === selectedLessonForPreview?.id))?.title}
            />

            {/* Sub-Modal: Reject Reason */}
            < ModalRejectReason
                open={rejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                course={course}
                onConfirmReject={(courseId, reason) => {
                    onReject(courseId, reason);
                    onClose();
                }}
            />
            {/* Sub-Modal: Validation Error */}
            <ModalValidationError
                open={validationErrorModal}
                onClose={() => setValidationErrorModal(false)}
                errors={validationReport.errors}
            />
        </>
    );
}
