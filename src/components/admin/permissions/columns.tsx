"use client"

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, ShieldAlert, ShieldCheck } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PermissionType as ZodPermissionType } from "@/types/generated-zod/schemas/models/Permission.schema"

export const columns: ColumnDef<ZodPermissionType>[] = [
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
            label: "Tên quyền",
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
                    Tên quyền
                    {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                    {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            const permission = row.original
            return (
                <div className="flex items-center gap-3 py-1 ml-4">
                    <span className="font-semibold text-primary">{permission.name}</span>
                </div>
            )
        },
    },
    {
        id: "label",
        meta: {
            label: "Tên hiển thị",
        },
        accessorKey: "label",
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
                    Tên hiển thị
                    {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                    {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            const label = row.original.label
            return (
                <Badge className={`ml-5 text-xs font-medium px-2 py-1 rounded`}>
                    {label}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableGlobalFilter: false
    },
    {
        id: "resource",
        accessorKey: "resource",
        meta: {
            label: "Resource",
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
                    Resource
                    {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                    {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            const resource = (row.original as any).resource;
            return (
                <Badge variant="outline" className={`ml-5 text-xs font-medium px-2 py-1 rounded`}>
                    {resource}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableGlobalFilter: false
    },
]
