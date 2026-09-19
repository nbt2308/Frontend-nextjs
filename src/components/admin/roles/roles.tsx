"use client"

import { useState, useMemo } from "react";
import { DataTable, DataTableSelectedActionConfig } from "../../ui/data-table";
import { getColumns } from "./columns";
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
import { House, Download, Lock, ShieldCheck, Trash2, CircleCheck, Shield, ShieldAlert, Plus, ShieldPlus } from "lucide-react";
import KpiCard from "@/components/shared/SummaryCard";
import { DataTableToolbar } from "@/components/shared/data-table-toolbar";
import { DataTableSelectedToolbar } from "@/components/shared/data-table-selection-toolbar";
import { useBulkDeleteRole, useRoles, useDeleteRole } from "@/hooks/useRole";
import ModalAddRole from "./modal-add-role";
import ModalEditRole from "./modal-edit-role";
import { ConfirmModal } from "@/components/shared/data-table-confirm-modal";

export default function RoleManagement() {

    const [filters, setFilters] = useState<FindAllQueryParams>({
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc"
    });

    const { data, isPending, isError, error, refetch } = useRoles(filters);
    const { mutate: bulkDelete } = useBulkDeleteRole();
    const { mutate: deleteRole, isPending: isDeletePending } = useDeleteRole();
    const [openAddModal, setOpenAddModal] = useState(false);

    // Modal states
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleEdit = (role: any) => {
        setSelectedRole(role);
        setIsEditOpen(true);
    };

    const handleDeleteClick = (role: any) => {
        setSelectedRole(role);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (selectedRole) {
            deleteRole(selectedRole.id, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setSelectedRole(null);
                    refetch();
                },
                onError: () => setIsDeleteOpen(false)
            });
        }
    };

    const tableColumns = useMemo(() => getColumns(handleEdit, handleDeleteClick), []);

    const rolesData = data?.roles || [];

    const roleFilters = [
        {
            columnId: "isSystemRole",
            title: "Hệ thống",
            options: [
                {
                    label: "Vai trò hệ thống",
                    value: "true",
                    icon: ShieldCheck,
                    count: rolesData.filter((r: any) => r.isSystemRole).length
                },
                {
                    label: "Vai trò tuỳ chỉnh",
                    value: "false",
                    icon: ShieldAlert,
                    count: rolesData.filter((r: any) => !r.isSystemRole).length
                },
            ],
        },
    ]

    const roleActions = [
        {
            label: "Thêm vai trò mới",
            icon: ShieldPlus,
            onClick: () => setOpenAddModal(true),
            isPrimary: true,
        },
    ]

    const roleSelectedActions: DataTableSelectedActionConfig<any>[] = [
        {
            label: "Xóa",
            icon: Trash2,
            variant: "destructive" as const,
            confirm: {
                title: "Xóa vĩnh viễn",
                description: `Bạn có chắc chắn muốn xóa các vai trò này không? (Sẽ không thể xoá vai trò hệ thống và vai trò đang có người dùng)`,
                confirmText: "Xóa",
            },
            onClick: (selectedRoles: any, table: any) => handleBulkDelete(selectedRoles, table),
        },
    ]

    if (isError) {
        return (
            <div className="p-6">
                <DataTableError error={error} refetch={refetch} />
            </div>
        )
    }

    const handleBulkDelete = (selectedRoles: any, table: any) => {
        const ids = selectedRoles.map((u: any) => u.id)
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
                            <BreadcrumbPage>Quản lý vai trò</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <Separator className="mt-2 mb-4" />
            <div className="space-y-4 mb-6">
                <div>
                    <span className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="w-8 h-8 text-primary" /> Vai trò & Phân quyền
                    </span>
                    <p className="text-muted-foreground text-sm mt-1">Quản lý vai trò và gán quyền hạn truy cập cho từng vai trò trong hệ thống.</p>
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
                            label="Tổng số vai trò"
                            value={data?.totalItems?.toString() || "0"}
                            icon={Shield}
                            iconColor="text-blue-500"
                            glowColor="bg-blue-500/15 border-blue-500/30"
                            valueColor="text-blue-500"
                            hoverBorderColor="hover:border-blue-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]"
                        />
                        <KpiCard
                            label="Vai trò hệ thống"
                            value={rolesData.filter((r: any) => r.isSystemRole).length.toString()}
                            icon={ShieldCheck}
                            iconColor="text-emerald-500"
                            glowColor="bg-emerald-500/15 border-emerald-500/30"
                            valueColor="text-emerald-500"
                            hoverBorderColor="hover:border-emerald-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                        />
                        <KpiCard
                            label="Vai trò tuỳ chỉnh"
                            value={rolesData.filter((r: any) => !r.isSystemRole).length.toString()}
                            icon={ShieldAlert}
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
                    columns={tableColumns}
                    data={rolesData}
                    isPending={isPending}
                >
                    {(table) => (
                        <div className="space-y-4">
                            <DataTableToolbar
                                table={table}
                                searchConfig={{
                                    placeholder: "Tìm kiếm tên vai trò...",
                                }}
                                filters={roleFilters}
                                actions={roleActions}
                            />
                            {
                                !isPending &&
                                <DataTableSelectedToolbar
                                    table={table}
                                    label="vai trò"
                                    actions={roleSelectedActions}
                                />
                            }
                        </div>
                    )}
                </DataTable>
            </div>
            {/* Modal Add Role */}
            <ModalAddRole
                open={openAddModal}
                closeDialog={() => setOpenAddModal(false)}
            />
            
            {/* Các Modals dùng chung */}
            {selectedRole && (
                <>
                    {isEditOpen && (
                        <ModalEditRole
                            open={isEditOpen}
                            closeDialog={() => { setIsEditOpen(false); setSelectedRole(null); }}
                            role={selectedRole}
                        />
                    )}
                    <ConfirmModal
                        isOpen={isDeleteOpen}
                        onClose={() => { setIsDeleteOpen(false); setSelectedRole(null); }}
                        title="Bạn có chắc chắn muốn xoá vai trò này?"
                        description={
                            <>
                                Hành động này sẽ xoá vai trò <strong className="text-foreground">{selectedRole.name}</strong>. Không thể xoá vai trò đang có người dùng hoặc vai trò hệ thống.
                            </>
                        }
                        onConfirm={confirmDelete}
                        confirmText="Xoá vĩnh viễn"
                        cancelText="Hủy"
                        variant="destructive"
                        isLoading={isDeletePending}
                    />
                </>
            )}
        </div>
    );
}
