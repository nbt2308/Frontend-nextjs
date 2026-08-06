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
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2Icon } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
    isLoading?: boolean;
}

export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Xác nhận thực hiện?",
    description = "Hành động này không thể hoàn tác.",
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    variant = "destructive",
    isLoading = false,
}: ConfirmModalProps) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading} onClick={onClose}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isLoading}
                        className={
                            variant === "destructive"
                                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                : ""
                        }
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
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
};