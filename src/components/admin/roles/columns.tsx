"use client"

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, ShieldAlert, ShieldCheck } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RoleType as ZodRoleType } from "@/types/generated-zod/schemas/models/Role.schema"
import { RoleCellAction } from "./role-cell-actions"

export const columns: ColumnDef<ZodRoleType>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "id",
        meta: {
            label: "ID",
        },
        accessorKey: "id",
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => {
                        if (isSorted === "asc") {
                            column.toggleSorting(true);
                        } else if (isSorted === "desc") {
                            column.clearSorting();
                        } else {
                            column.toggleSorting(false);
                        }
                    }}
                >
                    ID
                    {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                    {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            const id = row.getValue("id") as string
            return (
                <div className="ml-4 text-md max-w-md">
                    #{id}
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableGlobalFilter: false
    },
    {
        id: "name",
        meta: {
            label: "Vai trò",
        },
        accessorKey: "name",
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => {
                        if (isSorted === "asc") {
                            column.toggleSorting(true);
                        } else if (isSorted === "desc") {
                            column.clearSorting();
                        } else {
                            column.toggleSorting(false);
                        }
                    }}
                >
                    Tên vai trò
                    {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                    {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            const role = row.original
            return (
                <div className="flex items-center gap-3 py-1 ml-4">
                    <span className="font-semibold text-primary">{role.name}</span>
                </div>
            )
        },
    },
    {
        id: "usersCount",
        meta: {
            label: "Số người dùng",
        },
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => {
                        if (isSorted === "asc") {
                            column.toggleSorting(true);
                        } else if (isSorted === "desc") {
                            column.clearSorting();
                        } else {
                            column.toggleSorting(false);
                        }
                    }}
                >
                    Số người dùng
                    {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                    {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            const count = (row.original as any)._count?.users || 0;
            return (
                <Badge className={`ml-5 text-xs font-medium px-2 py-1 rounded`}>
                    {count}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableGlobalFilter: false
    },
    {
        id: "permissionsCount",
        meta: {
            label: "Số quyền",
        },
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => {
                        if (isSorted === "asc") {
                            column.toggleSorting(true);
                        } else if (isSorted === "desc") {
                            column.clearSorting();
                        } else {
                            column.toggleSorting(false);
                        }
                    }}
                >
                    Số quyền
                    {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                    {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            const count = (row.original as any).permissions?.length || 0;
            return (
                <Badge variant="outline" className={`ml-5 text-xs font-medium px-2 py-1 rounded`}>
                    {count}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableGlobalFilter: false
    },
    {
        id: "isSystemRole",
        meta: {
            label: "Hệ thống",
        },
        accessorKey: "isSystemRole",
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    onClick={() => {
                        if (isSorted === "asc") {
                            column.toggleSorting(true);
                        } else if (isSorted === "desc") {
                            column.clearSorting();
                        } else {
                            column.toggleSorting(false);
                        }
                    }}
                >
                    Hệ thống
                    {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                    {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            const isSystemRole = row.getValue("isSystemRole") as boolean
            return (
                <Badge className={
                    isSystemRole ?
                        "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                        :
                        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }>
                    {
                        isSystemRole ?
                            <ShieldCheck data-icon="inline-start" className="h-4 w-4" color="green" />
                            :
                            <ShieldAlert data-icon="inline-start" className="h-4 w-4" color="gray" />
                    }
                    {isSystemRole ? "Vai trò hệ thống" : "Vai trò tuỳ chỉnh"}
                </Badge>
            )
        },
        filterFn: (row, id, filterValue) => {
            if (!filterValue || filterValue.length === 0) return true;
            const rowValueString = String(row.getValue(id));
            return filterValue.includes(rowValueString);
        },
        enableGlobalFilter: false
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const role = row.original
            const isSystemRole = row.getValue("isSystemRole") as boolean
            return (
                <RoleCellAction role={role} status={isSystemRole} />
            )
        },
        enableGlobalFilter: false
    },
]
