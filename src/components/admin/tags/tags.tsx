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
import { House, Download, Lock, ShieldCheck, Trash2, CircleCheck, BookPlus, Tags } from "lucide-react";
import KpiCard from "@/components/shared/SummaryCard";
import { DataTableToolbar } from "@/components/shared/data-table-toolbar";
import { DataTableSelectedToolbar } from "@/components/shared/data-table-selection-toolbar";
import { toast } from "sonner";
import { useBulkDelete, useBulkUpdateStatus, useTags } from "@/hooks/useTag";
import ModalCreateTag from "./modal-create-tag";

export default function Tag() {

    const [filters, setFilters] = useState<FindAllQueryParams>({
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc"
    });

    const { data: tags, isPending, isError, error, refetch } = useTags(filters);
    const { mutate: bulkUpdateStatus } = useBulkUpdateStatus();
    const { mutate: bulkDelete } = useBulkDelete();
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const tagFilters = [
        {
            columnId: "status",
            title: "Trạng thái",
            options: [
                {
                    label: "Hoạt động",
                    value: "true",
                    icon: CircleCheck,
                    count: tags?.filter((tag: any) => tag.status === true).length
                },
                {
                    label: "Bị khoá",
                    value: "false",
                    icon: Lock,
                    count: tags?.filter((tag: any) => tag.status === false).length
                },
            ],
        },
    ]

    const tagActions = [
        {
            label: "Xuất Excel",
            icon: Download,
            variant: "outline" as const,
            onClick: () => true,
        },
        {
            label: "Thêm nhãn",
            icon: Tags,
            onClick: () => setOpenCreateModal(true),
            isPrimary: true,
        },
    ]
    const tagSelectedActions: DataTableSelectedActionConfig<any>[] = [
        {
            label: "Hoạt động",
            icon: ShieldCheck,
            variant: "outline" as const,
            confirm: {
                title: "Kích hoạt các mục đã chọn?",
                description: `Bạn có chắc chắn muốn kích hoạt các nhãn này không?`,
                confirmText: "Kích hoạt",
            },
            onClick: (selectedTags: any, table: any) => handleBulkChangeStatus(selectedTags, true, table),
        },
        {
            label: "Khoá",
            icon: Lock,
            variant: "outline" as const,
            confirm: {
                title: "Khoá các mục đã chọn?",
                description: `Bạn có chắc chắn muốn khoá các nhãn này không?`,
                confirmText: "Khoá",
            },
            onClick: (selectedTags: any, table: any) => handleBulkChangeStatus(selectedTags, false, table),
        },
        {
            label: "Xóa",
            icon: Trash2,
            variant: "destructive" as const,
            confirm: {
                title: "Xóa vĩnh viễn",
                description: `Bạn có chắc chắn muốn xóa các nhãn này không?`,
                confirmText: "Xóa vĩnh viễn",
            },
            onClick: (selectedTags: any, table: any) => handleBulkDelete(selectedTags, table),
        },
    ]

    if (isError) {
        return (
            <div className="p-6">
                <DataTableError error={error} refetch={refetch} />
            </div>
        )
    }

    
    const handleBulkChangeStatus = (selectedCourses: any, status: boolean, table: any) => {
        const ids = selectedCourses.map((course: any) => course.id)
        bulkUpdateStatus({ ids, status }, {
            onSuccess: () => {
                refetch();
                if (table) {
                    table.resetRowSelection();
                }
            }
        });
    }
    
    const handleBulkDelete = (selectedCourses: any, table: any) => {
        const ids = selectedCourses.map((u: any) => u.id)
        bulkDelete({ ids }, {
            onSuccess: () => {
                refetch();
                if (table) {
                    table.resetRowSelection();
                }
            }
        });
    }
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
                            <BreadcrumbPage>Quản lý nhãn</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <Separator className="mt-2 mb-4" />
            <div className="space-y-4 mb-6">
                <div>
                    <span className="text-2xl font-bold">Quản lý nhãn</span>
                    <p className="text-muted-foreground text-sm">Quản lý nhãn phân loại bài viết và khóa học.</p>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 mb-6 gap-4 justify-between">
                {isPending ? (
                    <>
                        <KpiCard.Skeleton />
                        <KpiCard.Skeleton />
                        <KpiCard.Skeleton />
                    </>
                ) : (
                    <>
                        <KpiCard
                            label="Tổng số nhãn"
                            value={tags?.length.toString()}
                            icon={Tags}
                            iconColor="text-blue-500"
                            glowColor="bg-blue-500/15 border-blue-500/30"
                            valueColor="text-blue-500"
                            hoverBorderColor="hover:border-blue-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]"
                        />
                        <KpiCard
                            label="Đang hoạt động"
                            value={tags?.filter((tag: any) => tag.status === true).length.toString()}
                            icon={CircleCheck}
                            iconColor="text-emerald-500"
                            glowColor="bg-emerald-500/15 border-emerald-500/30"
                            valueColor="text-emerald-500"
                            hoverBorderColor="hover:border-emerald-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                        />
                        <KpiCard
                            label="Bị khoá"
                            value={tags?.filter((tag: any) => tag.status === false).length.toString()}
                            icon={Lock}
                            iconColor="text-red-500"
                            glowColor="bg-red-500/15 border-red-500/30"
                            valueColor="text-red-500"
                            hoverBorderColor="hover:border-red-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                        />
                    </>
                )}
            </div>
            <div>
                <DataTable
                    columns={columns}
                    data={tags || []}
                    isPending={isPending}>
                    {(table) => (
                        <div className="space-y-4">

                            <DataTableToolbar
                                table={table}
                                searchConfig={{
                                    placeholder: "Tìm kiếm tag theo tên, slug...",
                                }}
                                filters={tagFilters}
                                actions={tagActions}
                            />
                            {
                                !isPending &&
                                <DataTableSelectedToolbar
                                    table={table}
                                    label="nhãn"
                                    actions={tagSelectedActions}
                                />
                            }
                        </div>
                    )}
                </DataTable>
            </div>
            {/* Modal Create Tag */}
            <ModalCreateTag
                open={openCreateModal}
                closeDialog={() => setOpenCreateModal(false)}
            />
        </div>
    );
}