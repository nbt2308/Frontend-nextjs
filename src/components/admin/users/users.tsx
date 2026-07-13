"use client"

import { DataTable, DataTableSelectedActionConfig } from "../../ui/data-table";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { useBulkDelete, useBulkUpdateStatus, useUsers } from "@/hooks/useUser";
import { useState } from "react";
import { UserQueryParams } from '@/hooks/useUser';

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
import { House, Download, UserPlus, ShieldUser, UserStar, UserCog, Lock, ShieldCheck, Trash2, CircleCheck, ShieldX } from "lucide-react";
import KpiCard from "@/components/shared/SummaryCard";
import { DataTableToolbar } from "@/components/shared/data-table-toolbar";
import { DataTableSelectedToolbar } from "@/components/shared/data-table-selection-toolbar";
import { toast } from "sonner";
export default function User() {
    const [filters, setFilters] = useState<UserQueryParams>({
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
        search: ""
    });
    const { data: users, isPending, isError, error, refetch } = useUsers(filters)

    const userFilters = [
        {
            columnId: "role",
            title: "Vai trò",
            options: [
                {
                    label: "Admin",
                    value: "ADMIN",
                    icon: ShieldUser,
                    count: users?.filter((user: any) => user.role === "ADMIN").length
                },
                {
                    label: "Instructor",
                    value: "INSTRUCTOR",
                    icon: UserCog,
                    count: users?.filter((user: any) => user.role === "INSTRUCTOR").length
                },
                {
                    label: "Student",
                    value: "STUDENT",
                    icon: UserStar,
                    count: users?.filter((user: any) => user.role === "STUDENT").length
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
            title: "Trạng thái",
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
            onClick: () => true, // Hàm mở modal của bạn
            isPrimary: true,
        },
    ]

    const userSelectedActions: DataTableSelectedActionConfig<any>[] = [
        {
            label: "Hoạt động",
            icon: ShieldCheck,
            variant: "outline" as const,
            onClick: (selectedUsers: any, table: any) => handleBulkChangeStatus(selectedUsers, true, table),
        },
        {
            label: "Khoá",
            icon: Lock,
            variant: "outline" as const,
            onClick: (selectedUsers: any, table: any) => handleBulkChangeStatus(selectedUsers, false, table),
        },
        {
            label: "Xóa",
            icon: Trash2,
            variant: "destructive" as const,
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

    const { mutate: bulkUpdateStatus } = useBulkUpdateStatus();
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
    const { mutate: bulkDelete } = useBulkDelete();
    const handleBulkDelete = (selectedUsers: any, table: any) => {
        const ids = selectedUsers.map((u: any) => u.id)
        if (selectedUsers.some((user: any) => user.role === "ADMIN")) {
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
                            <BreadcrumbLink href="/dashboard">Tổng quan</BreadcrumbLink>
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
                    <p className="text-muted-foreground text-sm">Quản lý phân quyền, trạng thái và thông tin của các thành viên trong hệ thống.</p>
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
                            label="Tổng số người dùng"
                            value={users?.length.toString()}
                            icon={House}
                        />
                        <KpiCard
                            label="Đang hoạt động"
                            value={users?.filter((user: any) => user.status === true).length.toString()}
                            icon={House}
                        />
                        <KpiCard
                            label="Bị khoá"
                            value={users?.filter((user: any) => user.status === false).length.toString()}
                            icon={House}
                        />
                    </>
                )}
            </div>
            <div>
                <DataTable columns={columns} data={users || []} isPending={isPending} >
                    {(table) => (
                        <div className="space-y-4">

                            <DataTableToolbar
                                table={table}
                                searchConfig={{
                                    columnId: "email",
                                    placeholder: "Tìm kiếm theo email user...",
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