"use client"

import { type Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "@/components/shared/data-table-faced-filter"
import { X, LucideIcon, Plus, MoreHorizontal } from "lucide-react"
import { DataTableViewOptions } from "./data-table-view-options"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile"
import { DataTableActionConfig, DataTableFilterConfig } from "../ui/data-table"



interface DataTableToolbarProps<TData> {
    table: Table<TData>
    searchConfig?: {
        placeholder: string
    }
    filters?: DataTableFilterConfig[]
    actions?: DataTableActionConfig[]
}

export function DataTableToolbar<TData>({
    table,
    searchConfig,
    filters = [],
    actions = [],
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const ismobile = useIsMobile()
    const primaryActions = actions.filter((action) => action.isPrimary)
    const secondaryActions = actions.filter((action) => !action.isPrimary)
    return (
        <div className="flex flex-col gap-3 sm:flex-row md:items-center md:justify-between px-3 py-3 border rounded-md">
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                {searchConfig && (
                    <Input
                        placeholder={searchConfig.placeholder}
                        value={table.getState().globalFilter ?? ""}
                        onChange={(event) => table.setGlobalFilter(event.target.value)}
                        className="h-8 w-full sm:w-[260px] md:w-[260px] lg:w-[260px]"
                    />
                )}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <DataTableViewOptions table={table} />
                    {filters.map((filter) => {
                        const column = table.getColumn(filter.columnId)
                        if (!column) return null

                        return (
                            <DataTableFacetedFilter
                                key={filter.columnId}
                                column={column}
                                title={filter.title}
                                options={filter.options}
                            />
                        )
                    })}
                    {!ismobile && isFiltered && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => table.resetColumnFilters()}
                            className="h-8 px-2 lg:px-3"
                        >
                            Reset
                            <X className="ml-2 h-4 w-4" />
                        </Button>
                    )}


                </div>

            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {primaryActions.map((action, index) => {
                    const Icon = action.icon || Plus
                    return (
                        <Button
                            key={index}
                            variant={action.variant || "default"}
                            size="sm"
                            className="h-8 flex-1 sm:flex-initial gap-2 shadow-sm font-medium"
                            onClick={action.onClick}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{action.label}</span>
                        </Button>
                    )
                })}
                {secondaryActions.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 px-2 gap-1.5 data-[state=open]:bg-muted">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                            {secondaryActions.map((action, index) => {
                                const Icon = action.icon
                                return (
                                    <DropdownMenuItem key={index} onClick={action.onClick} className="gap-2 cursor-pointer">
                                        {Icon && <Icon className="h-4 w-4 text-muted-foreground shrink-0" />}
                                        <span>{action.label}</span>
                                    </DropdownMenuItem>
                                )
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

        </div>
    )
}   