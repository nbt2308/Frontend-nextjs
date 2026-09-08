"use client"

import { useState } from "react";
import { DataTable, DataTableFilterConfig, DataTableSelectedActionConfig } from "../../ui/data-table";
import { columns } from "./columns";
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
import { useAllPermissions } from "@/hooks/usePermission";
import { PermissionType } from "@/types/generated-zod/schemas/models/Permission.schema";


export default function PermissionList() {

    const [filters, setFilters] = useState<FindAllQueryParams>({
        page: 1,
        limit: 10,
        sortBy: "name",
        sortOrder: "desc"
    });

    const { data, isPending, isError, error, refetch } = useAllPermissions();


    const permissionsData = data || [];

    const resources = permissionsData
        .filter((permission: PermissionType, index: number, self: PermissionType[]) =>
            index === self.findIndex((p: PermissionType) => p.resource === permission.resource)
        )
        .map((permission: PermissionType) => {
            const count = permissionsData.filter(
                (p: PermissionType) => p.resource === permission.resource
            ).length;

            return {
                label: permission.resource,
                value: permission.resource,
                icon: ShieldCheck,
                count
            };
        });
    const permissionFilters = [
        {
            columnId: "resource",
            title: "Resource",
            options: resources
        },
    ]

    if (isError) {
        return (
            <div className="p-6">
                <DataTableError error={error} refetch={refetch} />
            </div>
        )
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
                            <BreadcrumbPage>Danh sách quyền</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <Separator className="mt-2 mb-4" />
            <div className="space-y-4 mb-6">
                <div>
                    <span className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="w-8 h-8 text-primary" /> Danh sách quyền của hệ thống
                    </span>
                    <p className="text-muted-foreground text-sm mt-1">Danh sách các quyền trong hệ thống và tài nguyên mà các quyền này có thể truy cập.</p>
                </div>
            </div>
            <div>
                <DataTable
                    columns={columns}
                    data={permissionsData}
                    isPending={isPending}
                >
                    {(table) => (
                        <div className="space-y-4">
                            <DataTableToolbar
                                table={table}
                                searchConfig={{
                                    placeholder: "Tìm kiếm tên quyền,...",
                                }}
                                filters={permissionFilters}
                            />
                        </div>
                    )}
                </DataTable>
            </div>
        </div>
    );
}
