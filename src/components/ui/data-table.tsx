"use client"

import * as React from "react"

import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    ColumnFiltersState,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    Table as TanstackTable,
    RowData,
    ExpandedState,
    getExpandedRowModel
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton";
import { removeVietnameseTones } from "@/lib/utils"
import { DataTablePagination } from "@/components/shared/data-table-pagination";
import { LucideIcon } from "lucide-react";
import "@tanstack/react-table"


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    isPending: boolean,
    children?: (table: TanstackTable<TData>) => React.ReactNode,
    getSubRows?: (row: TData) => TData[] | undefined
}
export interface DataTableFilterConfig {
    columnId: string
    title: string
    options: {
        label: string
        value: string
        icon?: LucideIcon
        count?: number
    }[]
}

export interface DataTableActionConfig {
    label: string
    onClick: () => void
    icon?: LucideIcon
    variant?: "default" | "outline" | "secondary" | "ghost" | "destructive"
    isPrimary?: boolean
}

export interface DataTableSelectedActionConfig<TData> {
    label: string
    icon?: LucideIcon
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    onClick: (selectedData: TData[], table: TanstackTable<TData>) => void | Promise<void>
    confirm?: {
        title?: string;
        description?: string;
        confirmText?: string;
        cancelText?: string;
    };
}
export function DataTable<TData, TValue>({
    columns,
    data,
    isPending,
    children,
    getSubRows
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState<any>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [expanded, setExpanded] = React.useState<ExpandedState>({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getPaginationRowModel: getPaginationRowModel(),
        ...(getSubRows ? {
            getSubRows,
            getExpandedRowModel: getExpandedRowModel(),
            onExpandedChange: setExpanded,
        } : {}),
        state: {
            sorting,
            rowSelection,
            globalFilter,
            columnFilters,
            ...(getSubRows ? { expanded } : {}),
        }
    })


    const skeletonRowsCount = 5;

    return (
        <div className="flex flex-col gap-3">
            {children && children(table)}
            <div className="overflow-hidden rounded-md border my-3">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isPending ? (
                            Array.from({ length: skeletonRowsCount }).map((_, rowIndex) => (
                                <TableRow key={`skeleton-row-${rowIndex}`} className="hover:bg-transparent">
                                    {columns.map((col, colIndex) => {
                                        const widths = ["w-1/2", "w-3/4", "w-2/3", "w-5/6", "w-full"];
                                        const randomWidth = widths[(rowIndex + colIndex) % widths.length];

                                        return (
                                            <TableCell key={`skeleton-cell-${colIndex}`} className="py-4">
                                                <div className="space-y-1.5">
                                                    <Skeleton className={`h-4 ${randomWidth} rounded`} />
                                                </div>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell 
                                            key={cell.id} 
                                            style={
                                                // Apply left padding based on row depth for the first visible column (usually the name or expander)
                                                // Assuming the first column after select is the one to indent.
                                                // Actually, it's better to add the indentation logic in the column definition itself,
                                                // but since we want to keep it simple, we can add it to the row's first non-checkbox column or similar,
                                                // or just pass row to the cell. Wait, cell rendering handles it if we use row.depth inside the column definition.
                                                // Let's just pass `row` to the cell and let the column handle it, but wait, we don't need to change `TableCell` if we do it in `columns.tsx`!
                                                // Let's remove this thought and keep TableCell clean, I'll do it in columns.tsx.
                                                {}
                                            }
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                    Không tìm thấy dữ liệu phù hợp.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {
                !isPending &&
                <DataTablePagination table={table} />
            }
        </div>
    )
}