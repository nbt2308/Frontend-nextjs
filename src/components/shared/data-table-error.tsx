import React from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface DataTableErrorProps {
    error: any
    refetch?: () => void
}

export function DataTableError({ error, refetch }: DataTableErrorProps) {
    // Hàm bóc tách message thông minh để tránh lỗi hiển thị [object Object]
    const getErrorMessage = (err: any): string => {
        if (!err) return "Đã có lỗi không xác định xảy ra."
        if (typeof err === "string") return err
        if (err.message) return err.message
        if (err.response?.data?.message) return err.response.data.message
        return JSON.stringify(err)
    }

    return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950 animate-in fade-in-50 duration-300">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                <AlertCircle className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Không thể tải dữ liệu
            </h3>

            <p className="mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
                {getErrorMessage(error)}
            </p>

            {refetch && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    className="mt-6 gap-2 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Tải lại trang
                </Button>
            )}
        </div>
    )
}