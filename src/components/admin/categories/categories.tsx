"use client"

import { DataTable, DataTableSelectedActionConfig } from "../../ui/data-table";
import { useState, useMemo } from "react";

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
import { House, Lock, ShieldCheck, Trash2, CircleCheck, FolderTree, PlusCircle, ChevronsDown, ChevronsUp } from "lucide-react";
import KpiCard from "@/components/shared/SummaryCard";
import { DataTableToolbar } from "@/components/shared/data-table-toolbar";
import { DataTableSelectedToolbar } from "@/components/shared/data-table-selection-toolbar";
import { useAllCategories, useBulkDeleteCategory, useBulkUpdateCategoryStatus, useDeleteCategory } from "@/hooks/useCategory";
import ModalCreateCategory from "./modal-create-category";
import ModalEditCategory from "./modal-edit-category";
import ModalViewCategory from "./modal-view-category";
import { ConfirmModal } from "@/components/shared/data-table-confirm-modal";
import { getColumns } from "./columns";
import { CategoryType } from "@/types/generated-zod/schemas/models/Category.schema";

export type CategoryResponse = Omit<CategoryType, 'children'> & {
    children: CategoryType[];
};

export default function Category() {
    const { data: categories, isPending, isError, error, refetch } = useAllCategories();
    const { mutate: bulkUpdateStatus } = useBulkUpdateCategoryStatus();
    const { mutate: bulkDelete } = useBulkDeleteCategory();
    const { mutate: deleteCategory, isPending: isDeletePending } = useDeleteCategory();
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [defaultParentId, setDefaultParentId] = useState<number | null>(null);

    // Modal states
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleEdit = (category: any) => {
        setSelectedCategory(category);
        setIsEditOpen(true);
    };

    const handleView = (category: any) => {
        setSelectedCategory(category);
        setIsViewOpen(true);
    };

    const handleDeleteClick = (category: any) => {
        setSelectedCategory(category);
        setIsDeleteOpen(true);
    };

    const handleAddChild = (parentId: number) => {
        setDefaultParentId(parentId);
        setOpenCreateModal(true);
    };

    const openCreateRoot = () => {
        setDefaultParentId(null);
        setOpenCreateModal(true);
    };

    const confirmDelete = () => {
        if (selectedCategory) {
            deleteCategory(selectedCategory.id, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setSelectedCategory(null);
                    refetch();
                },
                onError: () => setIsDeleteOpen(false)
            });
        }
    };

    const tableColumns = useMemo(() => getColumns(handleEdit, handleView, handleDeleteClick, handleAddChild), []);

    const totalCount = useMemo(() => categories?.count?.total || 0, [categories]);
    const activeCount = useMemo(() => categories?.count?.active || 0, [categories]);
    const inactiveCount = useMemo(() => categories?.count?.inactive || 0, [categories]);
    const categoryFilters = [
        {
            columnId: "status",
            title: "Trạng thái",
            options: [
                {
                    label: "Hoạt động",
                    value: "true",
                    icon: CircleCheck,
                    count: activeCount
                },
                {
                    label: "Bị khoá",
                    value: "false",
                    icon: Lock,
                    count: inactiveCount
                },
            ],
        },
    ]

    const categorySelectedActions: DataTableSelectedActionConfig<any>[] = [
        {
            label: "Hoạt động",
            icon: ShieldCheck,
            variant: "outline" as const,
            confirm: {
                title: "Kích hoạt các mục đã chọn?",
                description: `Bạn có chắc chắn muốn kích hoạt các danh mục này không?`,
                confirmText: "Kích hoạt",
            },
            onClick: (selectedCategories: any, table: any) => handleBulkChangeStatus(selectedCategories, true, table),
        },
        {
            label: "Khoá",
            icon: Lock,
            variant: "outline" as const,
            confirm: {
                title: "Khoá các mục đã chọn?",
                description: `Bạn có chắc chắn muốn khoá các danh mục này không?`,
                confirmText: "Khoá",
            },
            onClick: (selectedCategories: any, table: any) => handleBulkChangeStatus(selectedCategories, false, table),
        },
        {
            label: "Xóa",
            icon: Trash2,
            variant: "destructive" as const,
            confirm: {
                title: "Xóa vĩnh viễn",
                description: `Bạn có chắc chắn muốn xóa các danh mục này không?`,
                confirmText: "Xóa vĩnh viễn",
            },
            onClick: (selectedCategories: any, table: any) => handleBulkDelete(selectedCategories, table),
        },
    ]

    if (isError) {
        return (
            <div className="p-6">
                <DataTableError error={error} refetch={refetch} />
            </div>
        )
    }


    const handleBulkChangeStatus = (selectedCategories: any, status: boolean, table: any) => {
        const ids = selectedCategories.map((c: any) => c.id)
        bulkUpdateStatus({ ids, status }, {
            onSuccess: () => {
                refetch();
                if (table) {
                    table.resetRowSelection();
                }
            }
        });
    }

    const handleBulkDelete = (selectedCategories: any, table: any) => {
        const ids = selectedCategories.map((u: any) => u.id)
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
                            <BreadcrumbPage>Quản lý danh mục khóa học</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <Separator className="mt-2 mb-4" />
            <div className="space-y-4 mb-6">
                <div>
                    <span className="text-2xl font-bold">Quản lý danh mục khóa học</span>
                    <p className="text-muted-foreground text-sm">Quản lý cấu trúc phân cấp danh mục khóa học (Tối đa 2 cấp).</p>
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
                            label="Tổng số danh mục"
                            value={totalCount.toString()}
                            icon={FolderTree}
                            iconColor="text-blue-500"
                            glowColor="bg-blue-500/15 border-blue-500/30"
                            valueColor="text-blue-500"
                            hoverBorderColor="hover:border-blue-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]"
                        />
                        <KpiCard
                            label="Đang hoạt động"
                            value={activeCount.toString()}
                            icon={CircleCheck}
                            iconColor="text-emerald-500"
                            glowColor="bg-emerald-500/15 border-emerald-500/30"
                            valueColor="text-emerald-500"
                            hoverBorderColor="hover:border-emerald-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                        />
                        <KpiCard
                            label="Bị khoá"
                            value={inactiveCount.toString()}
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
                    columns={tableColumns}
                    data={categories?.categories || []}
                    isPending={isPending}
                    getSubRows={(row: any) => row.children}
                >
                    {(table) => {
                        const categoryActions = [
                            {
                                label: "Mở rộng tất cả",
                                icon: ChevronsDown,
                                variant: "outline" as const,
                                onClick: () => table.toggleAllRowsExpanded(true),
                            },
                            {
                                label: "Thu gọn tất cả",
                                icon: ChevronsUp,
                                variant: "outline" as const,
                                onClick: () => table.toggleAllRowsExpanded(false),
                            },
                            {
                                label: "Thêm danh mục",
                                icon: PlusCircle,
                                onClick: openCreateRoot,
                                isPrimary: true,
                            },
                        ]
                        return (
                            <div className="space-y-4">
                                <DataTableToolbar
                                    table={table}
                                    searchConfig={{
                                        placeholder: "Tìm kiếm danh mục theo tên, slug...",
                                    }}
                                    filters={categoryFilters}
                                    actions={categoryActions}
                                />
                                {
                                    !isPending &&
                                    <DataTableSelectedToolbar
                                        table={table}
                                        label="danh mục"
                                        actions={categorySelectedActions}
                                    />
                                }
                            </div>
                        )
                    }}
                </DataTable>
            </div>

            {/* Modal Create Category */}
            <ModalCreateCategory
                open={openCreateModal}
                closeDialog={() => setOpenCreateModal(false)}
                defaultParentId={defaultParentId}
            />

            {/* Các Modals dùng chung */}
            {selectedCategory && (
                <>
                    {isEditOpen && (
                        <ModalEditCategory
                            open={isEditOpen}
                            closeDialog={() => { setIsEditOpen(false); setSelectedCategory(null); }}
                            category={selectedCategory}
                        />
                    )}
                    {isViewOpen && (
                        <ModalViewCategory
                            open={isViewOpen}
                            closeDialog={() => { setIsViewOpen(false); setSelectedCategory(null); }}
                            category={selectedCategory}
                        />
                    )}
                    <ConfirmModal
                        isOpen={isDeleteOpen}
                        onClose={() => { setIsDeleteOpen(false); setSelectedCategory(null); }}
                        onConfirm={confirmDelete}
                        title="Xóa danh mục?"
                        isLoading={isDeletePending}
                        description={
                            <>
                                Bạn có chắc chắn muốn xóa danh mục{" "}
                                <strong className="text-foreground">{selectedCategory?.name}</strong> không?
                            </>
                        }
                        confirmText="Xóa vĩnh viễn"
                    />
                </>
            )}
        </div>
    );
}