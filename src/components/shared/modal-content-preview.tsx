"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { FileText, NotebookText } from "lucide-react";

interface ModalContentPreviewProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    content?: string;
}

export default function ModalContentPreview({
    open,
    onClose,
    title,
    content,
}: ModalContentPreviewProps) {
    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
                <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30 shrink-0">
                    <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                        <NotebookText className="h-5 w-5 text-primary" />
                        {title || "Nội dung chi tiết"}
                    </DialogTitle>
                    <DialogDescription>
                        Nội dung chi tiết của bài học
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    <div
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: content || "" }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
