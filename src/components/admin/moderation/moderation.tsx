"use client";

import React, { useMemo, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Clock,
    CheckCircle2,
    XCircle,
    FileCheck,
    BookOpen,
    ShieldCheck,
    Eye,
    RotateCcw,
    LayoutGrid,
    Table as TableIcon,
    AlertCircle,
    Check,
    X,
    FolderKanban,
    Gift,
    Gem,
    Grid2x2,
    House,
} from "lucide-react";
import KpiCard from "@/components/shared/SummaryCard";
import { DataTable, DataTableFilterConfig } from "@/components/ui/data-table";
import { DataTableToolbar } from "@/components/shared/data-table-toolbar";
import { ModerationListCourse } from "./moderation.types";
import { getModerationColumns } from "./moderation-columns";
import ModalCourseReview from "./modal-course-review";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { TabNavigation } from "./components/tab-navigation";
import ViewModeSwitcher from "./components/view-mode-switcher";
import GridCardView from "./components/grid-card-view";
import { useModerationKpis, useModerationList } from "@/hooks/useCourse";
import { Loader2 } from "lucide-react";
import { CourseTypeSchema } from "@/types/generated-zod/schemas";

export default function Moderation() {
    const CourseType = CourseTypeSchema.enum;

    const [selectedStatusTab, setSelectedStatusTab] = useState<string>("PENDING");
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");

    const { data: kpiData, isPending } = useModerationKpis();
    const kpiCounts = kpiData || { pending: 0, approved: 0, rejected: 0, validPending: 0, total: 0 };

    const { data: listData, isLoading, refetch } = useModerationList({
        page: 1,
        limit: 1000, // Fetch a large batch to allow client-side filtering to work across all items for now
        status: selectedStatusTab !== "ALL" ? selectedStatusTab : undefined,
    });

    const courses = listData?.courses || [];

    // Modal state for detailed review
    const [reviewingCourseId, setReviewingCourseId] = useState<string | null>(null);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);

    // Data passed to table / grid filtered by the active Tab (already filtered by API but we can keep useMemo)
    const tabFilteredCourses = useMemo(() => {
        return courses;
    }, [courses]);

    // Categories list for faceted filter
    const categoryOptions = useMemo(() => {
        const map = new Map<string, number>();
        tabFilteredCourses.forEach((c: ModerationListCourse) => {
            const catName = c.category.name;
            map.set(catName, (map.get(catName) || 0) + 1);
        });
        return Array.from(map.entries()).map(([name, count]) => ({
            label: name,
            value: name,
            icon: Grid2x2,
            count,
        }));
    }, [tabFilteredCourses]);

    // Filter configs for existing DataTableToolbar
    const moderationFilters: DataTableFilterConfig[] = useMemo(() => {
        const freeCount = tabFilteredCourses.filter((c: ModerationListCourse) => c.courseType === CourseType.FREE).length;
        const paidCount = tabFilteredCourses.filter((c: ModerationListCourse) => c.courseType === CourseType.PAID).length;

        const filters: DataTableFilterConfig[] = [
            {
                columnId: "category",
                title: "Danh mục",
                options: categoryOptions,
            },
            {
                columnId: "price",
                title: "Loại khóa học",
                options: [
                    {
                        label: "Miễn phí",
                        value: "FREE",
                        icon: Gift,
                        count: freeCount,
                    },
                    {
                        label: "Trả phí",
                        value: "PAID",
                        icon: Gem,
                        count: paidCount,
                    },
                ],
            },
        ];

        // If in "ALL" tab, add status filter to toolbar
        if (selectedStatusTab === "ALL") {
            filters.unshift({
                columnId: "status",
                title: "Trạng thái",
                options: [
                    {
                        label: "Chờ duyệt",
                        value: "PENDING",
                        icon: Clock,
                        count: kpiCounts.pending,
                    },
                    {
                        label: "Đã duyệt",
                        value: "PUBLISHED",
                        icon: CheckCircle2,
                        count: kpiCounts.approved,
                    },
                    {
                        label: "Bị từ chối",
                        value: "REJECTED",
                        icon: XCircle,
                        count: kpiCounts.rejected,
                    },
                ],
            });
        }

        return filters;
    }, [tabFilteredCourses, categoryOptions, selectedStatusTab, kpiCounts]);

    // Handlers
    const handleOpenReview = (course: ModerationListCourse) => {
        setReviewingCourseId(course.id);
        setReviewModalOpen(true);
    };

    const handleApprove = async (courseId: string) => {
        // TODO: Call API to approve course
        toast.success("Khóa học đã được phê duyệt thành công!");
        refetch();
    };

    const handleReject = async (courseId: string, reason: string) => {
        // TODO: Call API to reject course with reason
        toast.info("Đã cập nhật trạng thái từ chối khóa học.");
        refetch();
    };


    // Columns definition for the existing DataTable
    const columns = useMemo(() => getModerationColumns(handleOpenReview), []);

    return (
        <div >
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/"><House className="h-4 w-4" /></BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin/dashboard">Admin Panel</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Kiểm duyệt khóa học</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Separator className="mt-2 mb-4" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div className="space-y-4 mb-6">
                    <div>
                        <span className="text-2xl font-bold">Kiểm duyệt khóa học</span>
                        <p className="text-muted-foreground text-sm">Thẩm định nội dung bài giảng, chất lượng video và tiêu chuẩn xuất bản theo quy chuẩn hệ thống.</p>
                    </div>
                </div>
            </div>

            {/*KPI SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {isPending ? (
                    <>
                        <KpiCard.Skeleton />
                        <KpiCard.Skeleton />
                        <KpiCard.Skeleton />
                    </>
                ) : (
                    <>
                        <KpiCard
                            label="Chờ phê duyệt"
                            value={kpiCounts.pending}
                            icon={Clock}
                            iconColor="text-amber-500"
                            glowColor="bg-amber-500/15 border-amber-500/30"
                            valueColor="text-foreground"
                            hoverBorderColor="hover:border-amber-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                            subtext="Khóa học đang chờ xem xét"
                        />

                        <KpiCard
                            label="Đã phê duyệt"
                            value={kpiCounts.approved}
                            icon={CheckCircle2}
                            iconColor="text-emerald-500"
                            glowColor="bg-emerald-500/15 border-emerald-500/30"
                            valueColor="text-foreground"
                            hoverBorderColor="hover:border-emerald-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                            subtext="Đang hoạt động trên nền tảng"
                        />

                        <KpiCard
                            label="Bị từ chối"
                            value={kpiCounts.rejected}
                            icon={XCircle}
                            iconColor="text-rose-500"
                            glowColor="bg-rose-500/15 border-rose-500/30"
                            valueColor="text-foreground"
                            hoverBorderColor="hover:border-rose-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]"
                            subtext="Cần giảng viên bổ sung & sửa đổi"
                        />
                    </>
                )}
            </div>

            {/*TABS NAVIGATION & VIEW MODE SWITCHER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-5 border-b border-border pb-3">
                <TabNavigation selectedStatusTab={selectedStatusTab} setSelectedStatusTab={setSelectedStatusTab} kpiCounts={kpiCounts} />

                {/* View Switcher: Bảng (DataTable có sẵn) hoặc Lưới thẻ (Grid) */}
                <ViewModeSwitcher viewMode={viewMode} setViewMode={setViewMode} />
            </div>

            {/*DATA TABLE / GRID RENDER */}
            {viewMode === "table" ? (

                <DataTable
                    columns={columns}
                    data={tabFilteredCourses}
                    isPending={isLoading}
                >
                    {(table) => (
                        <div className="space-y-4">
                            <DataTableToolbar
                                table={table}
                                searchConfig={{
                                    placeholder: "Tìm kiếm khóa học theo tiêu đề, slug, giảng viên...",
                                }}
                                filters={moderationFilters}
                            />
                        </div>
                    )}
                </DataTable>
            ) : (
                /* GRID CARDS VIEW */
                isLoading ? (
                    <div className="flex items-center justify-center p-24">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <GridCardView
                        courses={tabFilteredCourses}
                        handleOpenReview={handleOpenReview}
                    />
                )
            )}

            {/* MODAL COURSE REVIEW CHI TIẾT */}
            <ModalCourseReview
                open={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                courseId={reviewingCourseId}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </div>
    );
}