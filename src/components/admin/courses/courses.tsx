"use client"

import { DataTable, DataTableSelectedActionConfig } from "../../ui/data-table";
import { columns } from "./columns";
// import { useBulkDelete, useBulkUpdateStatus, useUsers } from "@/hooks/useUser";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DataTableError } from "@/components/shared/data-table-error";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator";
import { House, Download, UserPlus, ShieldUser, UserStar, UserCog, Lock, ShieldCheck, Trash2, CircleCheck, ShieldX, Users, UserPen, Book, Gift, Gem, Sprout, Zap, Rocket, Flame, BookPlus, BookOpen } from "lucide-react";
import KpiCard from "@/components/shared/SummaryCard";
import { DataTableToolbar } from "@/components/shared/data-table-toolbar";
import { DataTableSelectedToolbar } from "@/components/shared/data-table-selection-toolbar";
import { toast } from "sonner";
import { useCourses } from "@/hooks/useCourse";
import { CourseType, Level } from "@prisma/client";
import ModalCreateCourse from "./modal-create-course";
import { useAllTags, useTags } from "@/hooks/useTag";
import { useAllInstructors } from "@/hooks/useUser";

export default function Course() {

    const [filters, setFilters] = useState<FindAllQueryParams>({
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc"
    });

    const { data: courses, isPending, isError, error, refetch } = useCourses(filters);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const courseFilters = [
        {
            columnId: "courseType",
            title: "Loại khoá học",
            options: [
                {
                    label: "Miễn phí",
                    value: CourseType.FREE,
                    icon: Gift,
                    count: courses?.filter((course: any) => course.courseType === CourseType.FREE).length
                },
                {
                    label: "Trả phí",
                    value: CourseType.PAID,
                    icon: Gem,
                    count: courses?.filter((course: any) => course.courseType === CourseType.PAID).length
                }
            ],
        },
        {
            columnId: "level",
            title: "Cấp độ",
            options: [
                {
                    label: "Cơ bản",
                    value: Level.BEGINNER,
                    icon: Sprout,
                    count: courses?.filter((course: any) => course.level === Level.BEGINNER).length
                },
                {
                    label: "Trung cấp",
                    value: Level.INTERMEDIATE,
                    icon: Flame,
                    count: courses?.filter((course: any) => course.level === Level.INTERMEDIATE).length
                },
                {
                    label: "Nâng cao",
                    value: Level.ADVANCED,
                    icon: Rocket,
                    count: courses?.filter((course: any) => course.level === Level.ADVANCED).length
                },
            ],
        },
        {
            columnId: "status",
            title: "Trạng thái",
            options: [
                {
                    label: "Hoạt động",
                    value: "true",
                    icon: CircleCheck,
                    count: courses?.filter((course: any) => course.status === true).length
                },
                {
                    label: "Bị khoá",
                    value: "false",
                    icon: Lock,
                    count: courses?.filter((course: any) => course.status === false).length
                },
            ],
        },
    ]

    const courseActions = [
        {
            label: "Xuất Excel",
            icon: Download,
            variant: "outline" as const,
            onClick: () => true,
        },
        {
            label: "Thêm khoá học",
            icon: BookPlus,
            onClick: () => setOpenCreateModal(true),
            isPrimary: true,
        },
    ]
    const { data: tags, isLoading: isLoadingTags } = useAllTags();
    const { data: instructors, isLoading: isLoadingInstructors } = useAllInstructors();
    // const courseSelectedActions: DataTableSelectedActionConfig<any>[] = [
    //     {
    //         label: "Hoạt động",
    //         icon: ShieldCheck,
    //         variant: "outline" as const,
    //         onClick: (selectedCourses: any, table: any) => handleBulkChangeStatus(selectedCourses, true, table),
    //     },
    //     {
    //         label: "Khoá",
    //         icon: Lock,
    //         variant: "outline" as const,
    //         onClick: (selectedUsers: any, table: any) => handleBulkChangeStatus(selectedUsers, false, table),
    //     },
    //     {
    //         label: "Xóa",
    //         icon: Trash2,
    //         variant: "destructive" as const,
    //         onClick: (selectedUsers: any, table: any) => handleBulkDelete(selectedUsers, table),
    //     },
    // ]

    if (isError) {
        return (
            <div className="p-6">
                <DataTableError error={error} refetch={refetch} />
            </div>
        )
    }

    // const { mutate: bulkUpdateStatus } = useBulkUpdateStatus();
    // const handleBulkChangeStatus = (selectedUsers: any, status: boolean, table: any) => {
    //     const ids = selectedUsers.map((u: any) => u.id)
    //     bulkUpdateStatus({ ids, status }, {
    //         onSuccess: () => {
    //             refetch();
    //             if (table) {
    //                 table.resetRowSelection();
    //             }
    //         }
    //     });
    // }
    // const { mutate: bulkDelete } = useBulkDelete();
    // const handleBulkDelete = (selectedUsers: any, table: any) => {
    //     const ids = selectedUsers.map((u: any) => u.id)
    //     if (selectedUsers.some((user: any) => user.role === "ADMIN")) {
    //         toast.error("Không thể xóa admin");
    //         return;
    //     }
    //     bulkDelete({ ids }, {
    //         onSuccess: () => {
    //             refetch();
    //             if (table) {
    //                 table.resetRowSelection();
    //             }
    //         }
    //     });
    // }
    return (

        <div>
            <div>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/"><House className="h-4 w-4" /></BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Admin Panel</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Quản lý khóa học</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <Separator className="mt-2 mb-4" />
            <div className="space-y-4 mb-6">
                <div>
                    <span className="text-2xl font-bold">Quản lý khoá học</span>
                    <p className="text-muted-foreground text-sm">Quản lý thông tin các khoá học trong hệ thống.</p>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 mb-6 gap-4 justify-between">
                {isPending ? (
                    <>
                        <KpiCard.Skeleton />
                        <KpiCard.Skeleton />
                        <KpiCard.Skeleton />
                        <KpiCard.Skeleton />
                        <KpiCard.Skeleton />
                        <KpiCard.Skeleton />
                        <KpiCard.Skeleton />
                        <KpiCard.Skeleton />
                    </>
                ) : (
                    <>
                        <KpiCard
                            label="Tổng số khoá học"
                            value={courses?.length.toString()}
                            icon={BookOpen}
                            iconColor="text-blue-500"
                            glowColor="bg-blue-500/15 border-blue-500/30"
                            valueColor="text-blue-500"
                            hoverBorderColor="hover:border-blue-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]"
                        />
                        <KpiCard
                            label="Đang hoạt động"
                            value={courses?.filter((course: any) => course.status === true).length.toString()}
                            icon={CircleCheck}
                            iconColor="text-emerald-500"
                            glowColor="bg-emerald-500/15 border-emerald-500/30"
                            valueColor="text-emerald-500"
                            hoverBorderColor="hover:border-emerald-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                        />
                        <KpiCard
                            label="Bị khoá"
                            value={courses?.filter((course: any) => course.status === false).length.toString()}
                            icon={Lock}
                            iconColor="text-red-500"
                            glowColor="bg-red-500/15 border-red-500/30"
                            valueColor="text-red-500"
                            hoverBorderColor="hover:border-red-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                        />
                        <KpiCard
                            label="Khoá học miễn phí (Free)"
                            value={courses?.filter((course: any) => course.courseType === CourseType.FREE).length.toString()}
                            icon={Gift}
                            iconColor="text-green-500"
                            glowColor="bg-green-500/15 border-green-500/30"
                            valueColor="text-green-500"
                            hoverBorderColor="hover:border-green-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                        />
                        <KpiCard
                            label="Khoá học trả phí (Paid)"
                            value={courses?.filter((course: any) => course.courseType === CourseType.PAID).length.toString()}
                            icon={Gem}
                            iconColor="text-red-500"
                            glowColor="bg-red-500/15 border-red-500/30"
                            valueColor="text-red-500"
                            hoverBorderColor="hover:border-red-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                        />
                        <KpiCard
                            label="Khoá học cơ bản (Beginner)"
                            value={courses?.filter((course: any) => course.level === Level.BEGINNER).length.toString()}
                            icon={Sprout}
                            iconColor="text-sky-500"
                            glowColor="bg-sky-500/15 border-sky-500/30"
                            valueColor="text-sky-500"
                            hoverBorderColor="hover:border-sky-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(96,165,250,0.25)]"
                        />
                        <KpiCard
                            label="Khoá học trung cấp (Intermediate)"
                            value={courses?.filter((course: any) => course.level === Level.INTERMEDIATE).length.toString()}
                            icon={Zap}
                            iconColor="text-violet-500"
                            glowColor="bg-violet-500/15 border-violet-500/30"
                            valueColor="text-violet-500"
                            hoverBorderColor="hover:border-violet-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(139,92,246,0.25)]"
                        />
                        <KpiCard
                            label="Khoá học nâng cao (Advanced)"
                            value={courses?.filter((course: any) => course.level === Level.ADVANCED).length.toString()}
                            icon={Rocket}
                            iconColor="text-amber-500"
                            glowColor="bg-amber-500/15 border-amber-500/30"
                            valueColor="text-amber-500"
                            hoverBorderColor="hover:border-amber-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                        />
                    </>
                )}
            </div>
            <div>
                <DataTable
                    columns={columns}
                    data={courses || []}
                    isPending={isPending}>
                    {(table) => (
                        <div className="space-y-4">

                            <DataTableToolbar
                                table={table}
                                searchConfig={{
                                    placeholder: "Tìm kiếm khoá học theo tên, slug...",
                                }}
                                filters={courseFilters}
                                actions={courseActions}
                            />
                            {/* {
                                !isPending &&
                                <DataTableSelectedToolbar
                                    table={table}
                                    label="khoá học"
                                    actions={courseSelectedActions}
                                />
                            } */}
                        </div>
                    )}
                </DataTable>
            </div>
            {/* Modal Create Course */}
            <ModalCreateCourse
                open={openCreateModal}
                closeDialog={() => setOpenCreateModal(false)}
                instructors={instructors || []}
                tags={tags || []}
            />
        </div>
    );
}