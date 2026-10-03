import { useState, useEffect } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, LucideIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
    isOpen: boolean;
    Icon?: LucideIcon;
    type: 'submit' | 'delete';
    onClose: () => void;
    //case submit course
    onSubmit?: (id: string) => void;
    id?: string;
    //case delete course
    onConfirm?: (reason?: string) => void;
    title?: string;
    description?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
    isLoading?: boolean;

    // Props mới hỗ trợ nhập lý do
    hasReason?: boolean;           // Bật/tắt ô nhập lý do
    isReasonRequired?: boolean;    // Bắt buộc phải nhập lý do mới cho click Xác nhận
    reasonLabel?: string;          // Nhãn hiển thị cho ô nhập lý do
    reasonPlaceholder?: string;    // Placeholder cho ô nhập
    useTextarea?: boolean;         // Sử dụng Textarea thay vì Input 1 dòng

}

export const ConfirmModal = ({
    isOpen,
    Icon = Trash2,
    type,
    onClose,
    onSubmit,
    id,
    onConfirm,
    title = "Xác nhận thực hiện?",
    description = "Hành động này không thể hoàn tác.",
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    variant = "destructive",
    isLoading = false,
    hasReason = false,
    isReasonRequired = false,
    reasonLabel = "Lý do",
    reasonPlaceholder = "Nhập lý do xóa...",
    useTextarea = false,

}: ConfirmModalProps) => {
    const [deletedReason, setDeletedReason] = useState("");
    // Reset lý do mỗi khi modal đóng/mở
    useEffect(() => {
        if (!isOpen) {
            setDeletedReason("");
        }
    }, [isOpen]);

    const handleConfirm = () => {
        if (type === 'delete') {
            onConfirm?.(hasReason ? deletedReason.trim() : undefined);
        } else {
            onSubmit?.(id ?? "");
        }
    };


// Kiểm tra vô hiệu hóa nút Xác nhận nếu bắt buộc nhập lý do mà chưa nhập
const isConfirmDisabled =
    isLoading || (hasReason && isReasonRequired && !deletedReason.trim());

return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <AlertDialogContent size="sm">
            <AlertDialogHeader>
                <div className={cn("mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full", variant === "destructive" ? "bg-destructive/10 dark:bg-destructive/20  text-destructive dark:text-destructive" : "bg-primary/10 dark:bg-primary/20")}>
                    <Icon className="h-5 w-5" />
                </div>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>
                    {description}
                </AlertDialogDescription>
            </AlertDialogHeader>

            {hasReason && (
                <div className="space-y-2 my-2 text-left">
                    {reasonLabel && (
                        <Label
                            htmlFor="deletedReason"
                            className="text-xs font-medium text-slate-700 dark:text-slate-300"
                        >
                            {reasonLabel}{" "}
                            {isReasonRequired && (
                                <span className="text-destructive">*</span>
                            )}
                        </Label>
                    )}
                    {useTextarea ? (
                        <Textarea
                            id="deletedReason"
                            placeholder={reasonPlaceholder}
                            value={deletedReason}
                            onChange={(e) => setDeletedReason(e.target.value)}
                            disabled={isLoading}
                            className="resize-none text-sm"
                            rows={3}
                        />
                    ) : (
                        <Input
                            id="deletedReason"
                            placeholder={reasonPlaceholder}
                            value={deletedReason}
                            onChange={(e) => setDeletedReason(e.target.value)}
                            disabled={isLoading}
                            className="text-sm"
                        />
                    )}
                </div>
            )}

            <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading} onClick={onClose}>
                    {cancelText}
                </AlertDialogCancel>
                <AlertDialogAction
                    disabled={isConfirmDisabled}
                    className={
                        variant === "destructive"
                            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            : ""
                    }
                    onClick={(e) => {
                        e.preventDefault();
                        handleConfirm();
                    }}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý...
                        </>
                    ) : (
                        confirmText
                    )}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);
}

export default ConfirmModal;