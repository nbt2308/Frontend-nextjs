import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle, AlertTriangle, FileVideo, FileQuestion, BookOpen, ImageIcon, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ValidationError {
    code: string;
    message: string;
    lessonId?: number;
    lessonTitle?: string;
    resourceId?: number;
    resourceName?: string;
    meta?: any;
}

interface ModalValidationErrorProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    errors: ValidationError[];
}

export default function ModalValidationError({
    open,
    onClose,
    title = "Không thể thực hiện yêu cầu",
    message = "Vui lòng khắc phục các lỗi sau trước khi tiếp tục:",
    errors = [],
}: ModalValidationErrorProps) {
    if (!open) return null;

    const getErrorIcon = (code: string) => {
        if (code.includes("LESSON")) return <BookOpen className="h-4 w-4 text-rose-500" />;
        if (code.includes("VIDEO")) return <FileVideo className="h-4 w-4 text-rose-500" />;
        if (code.includes("RESOURCE")) return <FileText className="h-4 w-4 text-rose-500" />;
        if (code.includes("THUMBNAIL")) return <ImageIcon className="h-4 w-4 text-rose-500" />;
        return <AlertTriangle className="h-4 w-4 text-rose-500" />;
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl border-rose-100 dark:border-rose-900 shadow-2xl">
                {/* Header */}
                <DialogHeader className="px-6 py-5 border-b border-border bg-rose-50 dark:bg-rose-950/20">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400 shrink-0">
                            <XCircle className="h-6 w-6" />
                        </div>
                        <div className="space-y-1.5 mt-1">
                            <DialogTitle className="text-lg font-bold text-rose-700 dark:text-rose-400">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="text-sm font-medium text-rose-600/80 dark:text-rose-400/80">
                                {message}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Error List */}
                <div className="p-6 max-h-[60vh] overflow-y-auto bg-background">
                    <div className="space-y-3">
                        {errors.map((error, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col gap-2 p-4 rounded-lg border border-border bg-muted/30 relative overflow-hidden"
                            >
                                {/* Left accent border */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500/50" />
                                
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 shrink-0 bg-background border rounded-md p-1.5 shadow-sm">
                                        {getErrorIcon(error.code)}
                                    </div>
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] uppercase font-mono text-muted-foreground border-border/80">
                                                {error.code.replace(/_/g, " ")}
                                            </Badge>
                                            
                                            {error.lessonTitle && (
                                                <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                                    Bài: {error.lessonTitle}
                                                </Badge>
                                            )}
                                        </div>
                                        
                                        <div className="text-sm font-medium text-foreground leading-relaxed">
                                            {error.message}
                                        </div>
                                        
                                        {error.resourceName && (
                                            <div className="text-xs text-muted-foreground flex items-center gap-1.5 bg-background border px-2.5 py-1.5 rounded-md inline-flex max-w-full">
                                                <FileQuestion className="h-3.5 w-3.5 shrink-0" />
                                                <span className="truncate">{error.resourceName}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="border-t border-border bg-muted/20 sm:justify-end">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-6 font-medium"
                    >
                        Đã hiểu & Đóng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
