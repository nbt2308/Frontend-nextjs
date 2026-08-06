import React from "react"
import { Table } from "@tanstack/react-table"
import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTableSelectedActionConfig } from "../ui/data-table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DataTableSelectedToolbarProps<TData> {
    table: Table<TData>
    label?: string
    actions?: DataTableSelectedActionConfig<TData>[]
}

export function DataTableSelectedToolbar<TData>({
    table,
    label = "mục",
    actions = [],
}: DataTableSelectedToolbarProps<TData>) {

    const selectedRows = table.getFilteredSelectedRowModel()?.rows || []
    const selectedCount = selectedRows.length

    if (selectedCount === 0) return null

    const selectedData = selectedRows.map((row) => row.original)

    return (
        <div className="flex flex-wrap items-center justify-between p-2.5 rounded-lg border animate-fade-in gap-2">

            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <span>
                    Đã chọn{" "}
                    <strong className="text-zinc-900 dark:text-white font-mono">
                        {selectedCount}
                    </strong>{" "}
                    {label}
                </span>
                <button
                    onClick={() => table.resetRowSelection()}
                    className="text-xs text-red-400 hover:text-red-600 dark:hover:text-red-300 underline ml-2 cursor-pointer"
                >
                    Bỏ chọn
                </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                {actions.length > 0 && (
                    <span className="text-xs text-zinc-400 hidden sm:inline mr-1">
                        Thay đổi hàng loạt:
                    </span>
                )}

                {actions.map((action, index) => {
                    const Icon = action.icon;

                    const renderButton = (
                        <Button
                            variant={action.variant || "outline"}
                            size="sm"
                            className="h-8 gap-1.5 text-xs font-medium"
                            onClick={!action.confirm ? () => action.onClick(selectedData, table) : undefined}
                        >
                            {Icon && <Icon className="h-3.5 w-3.5" />}
                            {action.label}
                        </Button>
                    );

                    if (!action.confirm) {
                        return <React.Fragment key={index}>{renderButton}</React.Fragment>;
                    }

                    return (
                        <AlertDialog key={index}>
                            <AlertDialogTrigger asChild>
                                {renderButton}
                            </AlertDialogTrigger>
                            <AlertDialogContent size="sm">
                                <AlertDialogHeader>
                                    <AlertDialogMedia >
                                        {Icon && <Icon className="h-3.5 w-3.5" />}
                                    </AlertDialogMedia>
                                    <AlertDialogTitle>
                                        {action.confirm.title || "Xác nhận thực hiện?"}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {action.confirm.description || "Hành động này không thể hoàn tác."}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        {action.confirm.cancelText || "Hủy"}
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => action.onClick(selectedData, table)}
                                        className={action.variant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
                                    >
                                        {action.confirm.confirmText || "Xác nhận"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    );
                })}
            </div>
        </div>
    )
}