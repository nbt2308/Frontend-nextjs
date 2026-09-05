"use client"

import { DataTable, DataTableSelectedActionConfig } from "../../ui/data-table";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { useBulkDelete, useBulkUpdateStatus, useUsers } from "@/hooks/useUser";
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
import { House, Download, UserPlus, ShieldUser, UserStar, UserCog, Lock, ShieldCheck, Trash2, CircleCheck, ShieldX, Users, UserPen } from "lucide-react";
import KpiCard from "@/components/shared/SummaryCard";
import { DataTableToolbar } from "@/components/shared/data-table-toolbar";
import { DataTableSelectedToolbar } from "@/components/shared/data-table-selection-toolbar";
import { toast } from "sonner";
import { RoleSchema } from "@/types/generated-zod/schemas";
import { SYSTEM_ROLES } from "@/constants/roles.constant";
import { UserType } from "@/types/generated-zod/schemas/models/User.schema";
import { RoleType } from "@/types/generated-zod/schemas/models/Role.schema";
export default function User() {
    const [filters, setFilters] = useState<FindAllQueryParams>({
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc"
    });
    const { data: users, isPending, isError, error, refetch } = useUsers(filters)
    const { mutate: bulkUpdateStatus } = useBulkUpdateStatus();
    const { mutate: bulkDelete } = useBulkDelete();
    //count
    const adminCount = users?.filter((user: UserType) =>
        user.roles.some(
            (role: RoleType) => role.name === SYSTEM_ROLES.ADMIN
        )
    ).length ?? 0;

    const instructorCount = users?.filter((user: UserType) =>
        user.roles.some(
            (role: RoleType) => role.name === SYSTEM_ROLES.INSTRUCTOR
        )
    ).length ?? 0;

    const studentCount = users?.filter((user: UserType) =>
        user.roles.some(
            (role: RoleType) => role.name === SYSTEM_ROLES.STUDENT
        )
    ).length ?? 0;
    const userFilters = [
        {
            columnId: "roles",
            title: "Vai trò",
            options: [
                {
                    label: "Admin",
                    value: SYSTEM_ROLES.ADMIN,
                    icon: ShieldUser,
                    count: adminCount
                },
                {
                    label: "Instructor",
                    value: SYSTEM_ROLES.INSTRUCTOR,
                    icon: UserCog,
                    count: instructorCount
                },
                {
                    label: "Student",
                    value: SYSTEM_ROLES.STUDENT,
                    icon: UserStar,
                    count: studentCount
                },
            ],
        },
        {
            columnId: "isActive",
            title: "Kích hoạt",
            options: [
                {
                    label: "Đã kích hoạt",
                    value: "true",
                    icon: ShieldCheck,
                    count: users?.filter((user: any) => user.isActive === true).length
                },
                {
                    label: "Chưa kích hoạt",
                    value: "false",
                    icon: ShieldX,
                    count: users?.filter((user: any) => user.isActive === false).length
                },
            ],
        },
        {
            columnId: "status",
            title: "Trạng thái tài khoản",
            options: [
                {
                    label: "Hoạt động",
                    value: "true",
                    icon: CircleCheck,
                    count: users?.filter((user: any) => user.status === true).length
                },
                {
                    label: "Bị khoá",
                    value: "false",
                    icon: Lock,
                    count: users?.filter((user: any) => user.status === false).length
                },
            ],
        },
    ]

    const userActions = [
        {
            label: "Xuất Excel",
            icon: Download,
            variant: "outline" as const,
            onClick: () => true,
        },
        {
            label: "Thêm thành viên",
            icon: UserPlus,
            onClick: () => true,
            isPrimary: true,
        },
    ]

    const userSelectedActions: DataTableSelectedActionConfig<any>[] = [
        {
            label: "Hoạt động",
            icon: ShieldCheck,
            variant: "outline" as const,
            confirm: {
                title: "Kích hoạt các mục đã chọn?",
                description: `Bạn có chắc chắn muốn kích hoạt những người dùng này không?`,
                confirmText: "Kích hoạt",
            },
            onClick: (selectedUsers: any, table: any) => handleBulkChangeStatus(selectedUsers, true, table),
        },
        {
            label: "Khoá",
            icon: Lock,
            variant: "outline" as const,
            confirm: {
                title: "Khoá các mục đã chọn?",
                description: `Bạn có chắc chắn muốn khoá những người dùng này không?`,
                confirmText: "Khoá",
            },
            onClick: (selectedUsers: any, table: any) => handleBulkChangeStatus(selectedUsers, false, table),
        },
        {
            label: "Xóa",
            icon: Trash2,
            variant: "destructive" as const,
            confirm: {
                title: "Xóa các mục đã chọn?",
                description: `Bạn có chắc chắn muốn xóa những người dùng này không?`,
                confirmText: "Xóa",
            },
            onClick: (selectedUsers: any, table: any) => handleBulkDelete(selectedUsers, table),
        },
    ]
    if (isError) {
        return (
            <div className="p-6">
                <DataTableError error={error} refetch={refetch} />
            </div>
        )
    }


    const handleBulkChangeStatus = (selectedUsers: any, status: boolean, table: any) => {
        const ids = selectedUsers.map((u: any) => u.id)
        bulkUpdateStatus({ ids, status }, {
            onSuccess: () => {
                refetch();
                if (table) {
                    table.resetRowSelection();
                }
            }
        });
    }

    const handleBulkDelete = (selectedUsers: any, table: any) => {
        const ids = selectedUsers.map((u: any) => u.id)
        if (selectedUsers.some((user: UserType) => user.roles.some((role: RoleType) => role.name === SYSTEM_ROLES.ADMIN))) {
            toast.error("Không thể xóa admin");
            return;
        }
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
                            <BreadcrumbPage>Quản lý người dùng</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <Separator className="mt-2 mb-4" />
            <div className="space-y-4 mb-6">
                <div>
                    <span className="text-2xl font-bold">Quản lý người dùng</span>
                    <p className="text-muted-foreground text-sm">Quản lý phân quyền, trạng thái và thông tin người dùng trong hệ thống.</p>
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
                            label="Tổng số người dùng"
                            value={users?.length.toString()}
                            icon={Users}
                            iconColor="text-blue-500"
                            glowColor="bg-blue-500/15 border-blue-500/30"
                            valueColor="text-blue-500"
                            hoverBorderColor="hover:border-blue-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]"
                        />
                        <KpiCard
                            label="Đang hoạt động"
                            value={users?.filter((user: any) => user.status === true).length.toString()}
                            icon={CircleCheck}
                            iconColor="text-emerald-500"
                            glowColor="bg-emerald-500/15 border-emerald-500/30"
                            valueColor="text-emerald-500"
                            hoverBorderColor="hover:border-emerald-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                        />
                        <KpiCard
                            label="Bị khoá"
                            value={users?.filter((user: any) => user.status === false).length.toString()}
                            icon={Lock}
                            iconColor="text-red-500"
                            glowColor="bg-red-500/15 border-red-500/30"
                            valueColor="text-red-500"
                            hoverBorderColor="hover:border-red-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                        />
                        <KpiCard
                            label="Đã kích hoạt"
                            value={users?.filter((user: any) => user.isActive === true).length.toString()}
                            icon={ShieldCheck}
                            iconColor="text-green-500"
                            glowColor="bg-green-500/15 border-green-500/30"
                            valueColor="text-green-500"
                            hoverBorderColor="hover:border-green-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                        />
                        <KpiCard
                            label="Chưa kích hoạt"
                            value={users?.filter((user: any) => user.isActive === false).length.toString()}
                            icon={ShieldX}
                            iconColor="text-red-500"
                            glowColor="bg-red-500/15 border-red-500/30"
                            valueColor="text-red-500"
                            hoverBorderColor="hover:border-red-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                        />
                        <KpiCard
                            label="Quản trị viên"
                            value={adminCount.toString()}
                            icon={UserCog}
                            iconColor="text-purple-500"
                            glowColor="bg-purple-500/15 border-purple-500/30"
                            valueColor="text-purple-500"
                            hoverBorderColor="hover:border-purple-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                        />
                        <KpiCard
                            label="Giảng viên"
                            value={instructorCount.toString()}
                            icon={UserPen}
                            iconColor="text-orange-500"
                            glowColor="bg-orange-500/15 border-orange-500/30"
                            valueColor="text-orange-500"
                            hoverBorderColor="hover:border-orange-500/60"
                            hoverShadowColor="hover:shadow-[0_0_20px_rgba(249,115,22,0.25)]"
                        />
                        <KpiCard
                            label="Học viên"
                            value={studentCount.toString()}
                            icon={UserStar}
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
                    data={users || []}
                    isPending={isPending}>
                    {(table) => (
                        <div className="space-y-4">

                            <DataTableToolbar
                                table={table}
                                searchConfig={{
                                    placeholder: "Tìm kiếm người dùng theo tên, email...",
                                }}
                                filters={userFilters}
                                actions={userActions}
                            />
                            {
                                !isPending &&
                                <DataTableSelectedToolbar
                                    table={table}
                                    label="người dùng"
                                    actions={userSelectedActions}
                                />
                            }
                        </div>
                    )}
                </DataTable>
            </div>
        </div>
    );
}