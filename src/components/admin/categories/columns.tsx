"use client"

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, CircleCheck, Lock, ChevronRight, ChevronDown, Folder, FileCode2, FolderGit2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CategoryType } from "@/types/generated-zod/schemas/models/Category.schema"
import { CategoryCellAction } from "./category-cell-actions"

export const getColumns = (
    onEdit: (category: CategoryType) => void,
    onView: (category: CategoryType) => void,
    onDelete: (category: CategoryType) => void,
    onAddChild: (parentId: number) => void
): ColumnDef<CategoryType>[] => [
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
                <div style={{ paddingLeft: `${row.depth * 2}rem` }} className="flex items-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "category_info",
            meta: {
                label: "Tên danh mục",
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
                        Tên danh mục & Cấu trúc
                        {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                        {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                        {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                    </Button>
                )
            },
            cell: ({ row }) => {
                const category = row.original

                return (
                    <div className="flex items-center gap-2 py-1">
                        <div className="flex items-center gap-2">
                            {/* Expand Button */}
                            {row.getCanExpand() ? (
                                <button
                                    onClick={row.getToggleExpandedHandler()}
                                    className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                                >
                                    {row.getIsExpanded() ? (
                                        <ChevronDown className="w-4 h-4" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4" />
                                    )}
                                </button>
                            ) : (
                                <span className="w-6 inline-block"></span>
                            )}

                            {/* Indentation Tree Connector */}
                            {row.depth === 1 && <span className="text-slate-300 font-mono text-sm">├──</span>}
                            {row.depth === 2 && <span className="text-slate-300 font-mono text-sm">└──</span>}

                            {/* Thumbnail / Icon */}
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden shrink-0 border 
                            ${row.depth === 0 ? 'bg-brand-100 text-brand-600 border-brand-200' :
                                    row.depth === 1 ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                        'bg-indigo-50 text-indigo-600 border-indigo-200'}
                        `}>
                                {category.thumbnail ? (
                                    <img src={category.thumbnail} className="w-full h-full object-cover" alt={category.name} />
                                ) : (
                                    row.depth === 0 ? <Folder className="w-4 h-4" /> :
                                        row.depth === 1 ? <FolderGit2 className="w-3.5 h-3.5" /> :
                                            <FileCode2 className="w-3 h-3" />
                                )}
                            </div>

                            <div className="leading-tight">
                                <div className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-brand-600 transition-colors">
                                    {category.name}
                                </div>
                                {category.description && <p className="text-xs text-slate-500 truncate max-w-xs">{category.description}</p>}
                            </div>
                        </div>
                    </div>
                )
            },
        },
        {
            id: "slug",
            meta: {
                label: "Slug (Đường dẫn)",
            },
            accessorKey: "slug",
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
                        Slug (Đường dẫn)
                        {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                        {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                        {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                    </Button>
                )
            },
            cell: ({ row }) => {
                const slug = row.getValue("slug") as string
                return (
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-600 dark:text-slate-300">
                        {slug}
                    </span>
                )
            },
        },
        {
            id: "level",
            meta: {
                label: "Cấp",
            },
            header: "Cấp",
            cell: ({ row }) => {
                const depth = row.depth;
                const bg = depth === 0 ? "bg-purple-50 text-purple-700 border-purple-200" :
                    depth === 1 ? "bg-blue-50 text-blue-700 border-blue-200" :
                        "bg-amber-50 text-amber-700 border-amber-200";
                const label = depth === 0 ? "Gốc (Level 0)" : depth === 1 ? "Cấp 1" : "Cấp 2 (Tối đa)";

                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${bg}`}>
                        {label}
                    </span>
                )
            }
        },
        {
            id: "coursesCount",
            meta: {
                label: "Khóa học",
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
                        Khóa học
                        {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                        {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                        {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                    </Button>
                )
            },
            cell: ({ row }) => {
                const count = (row.original as any)._count?.courses || 0;
                return (
                    <Badge className="ml-2 text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 border-0">
                        {count}
                    </Badge>
                )
            },
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
                const rowValueString = String(row.getValue(id));
                return filterValue.includes(rowValueString);
            },
            enableGlobalFilter: false
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const category = row.original
                const status = row.getValue("status") as boolean
                const depth = row.depth
                return (
                    <CategoryCellAction
                        category={category as any}
                        status={status}
                        onEdit={onEdit as any}
                        onView={onView as any}
                        onDelete={onDelete as any}
                        onAddChild={onAddChild}
                        depth={depth}
                    />
                )
            },
            enableGlobalFilter: false
        },
    ]