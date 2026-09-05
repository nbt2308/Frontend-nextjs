"use client"

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, CircleCheck, Lock, Rocket, Sprout, Zap } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// import { UserCellAction } from "./user-cell-actions"
import { TagType as ZodTagType } from "@/types/generated-zod/schemas/models/Tag.schema"
import { TagCellAction } from "./tag-cell-actions"
// import { CourseCellAction } from "./course-cell-actions"


export const columns: ColumnDef<ZodTagType>[] = [
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
        id: "tag_info",
        meta: {
            label: "Nhãn",
        },
        accessorFn: (row) => `${row.name} ${row.slug}`,
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
                    Tên Tag và Slug
                    {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                    {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            const tag = row.original


            return (
                <div className="flex items-center gap-3 py-1">
                    <div className="leading-tight">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                            <span>{tag.name}</span>
                        </div>
                        <span className="text-xs font-mono text-zinc-400">{tag.slug}</span>
                    </div>
                </div>
            )
        },
    },
    {
        id: "description",
        meta: {
            label: "Mô tả",
        },
        accessorKey: "description",
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
                    Mô tả
                    {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                    {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            const description = row.getValue("description") as string

            return (
                <div className="text-xs max-w-xs truncate">
                    {description}
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableGlobalFilter: false
    },
    {
        id: "coursesCount",
        meta: {
            label: "Khoá học",
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
                    Khoá học
                    {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                    {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            const count = (row.original as any)._count?.courses || 0;
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
        id: "postsCount",
        meta: {
            label: "Bài viết",
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
                    Bài viết
                    {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                    {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            const count = (row.original as any)._count?.posts || 0;
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
        id: "status",
        meta: {
            label: "Trạng thái",
        },
        accessorKey: "status",
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
                    Trạng thái
                    {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                    {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            const status = row.getValue("status") as boolean
            return (
                <Badge className={
                    status ?
                        "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                        :
                        "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                }>
                    {
                        status ?
                            <CircleCheck data-icon="inline-start" className="h-4 w-4" color="green" />
                            :
                            <Lock data-icon="inline-start" className="h-4 w-4" color="red" />
                    }
                    {status ? "Hoạt động" : "Bị khoá"}
                </Badge>
            )
        },
        filterFn: (row, id, filterValue) => {
            if (!filterValue || filterValue.length === 0) return true;

            // Chuyển giá trị boolean của hàng thành string: true -> "true"
            const rowValueString = String(row.getValue(id));

            return filterValue.includes(rowValueString);
        },
        enableGlobalFilter: false
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const tag = row.original
            const status = row.getValue("status") as boolean
            return (
                <TagCellAction tag={tag} status={status} />
            )
        },
        enableGlobalFilter: false
    },
]