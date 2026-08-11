"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, Lock, Tags, BookOpen, FileText, Calendar, Hash, Globe, Clock, FileCode } from "lucide-react";
import React from "react";
import { TagType } from "@/types/generated-zod/schemas/models/Tag.schema";
import { formatDate } from "@/lib/utils";

interface ModalViewTagProps {
    open: boolean;
    closeDialog: () => void;
    tag?: TagType | any;
}

export default function ModalViewTag({ open, closeDialog, tag }: ModalViewTagProps) {
    if (!tag) return null;

    const coursesCount = tag?._count?.courses ?? (tag?.courses?.length || 0);
    const postsCount = tag?._count?.posts ?? (tag?.posts?.length || 0);


    return (
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) closeDialog(); }}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
                <DialogHeader className="space-y-1">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Tags className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">Chi Tiết Tag</DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                Thông tin tổng quan và chi tiết của tag #{tag.id}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <Separator />

                <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-2">
                    {/* Tag Summary Header Card */}
                    <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                    <span>{tag.name}</span>
                                </h3>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono mt-0.5">
                                    <Globe className="h-3.5 w-3.5 text-zinc-400" />
                                    <span>{tag.slug}</span>
                                </div>
                            </div>
                            <Badge variant="outline" className="font-mono text-xs px-2.5 py-1 bg-background shrink-0">
                                <Hash className="h-3 w-3 mr-1 text-muted-foreground" />
                                ID: {tag.id}
                            </Badge>
                        </div>
                    </div>

                    {/* Stats Summary Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg border bg-card flex flex-col justify-between space-y-2">
                            <span className="text-[11px] font-medium text-muted-foreground uppercase">Trạng thái</span>
                            <div>
                                <Badge className={
                                    tag.status ?
                                        "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                                        :
                                        "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                                }>
                                    {tag.status ? (
                                        <CircleCheck className="mr-1 h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                        <Lock className="mr-1 h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                                    )}
                                    {tag.status ? "Hoạt động" : "Bị khóa"}
                                </Badge>
                            </div>
                        </div>

                        <div className="p-3 rounded-lg border bg-card flex flex-col justify-between space-y-1">
                            <div className="flex items-center justify-between text-muted-foreground">
                                <span className="text-[11px] font-medium uppercase">Khóa học</span>
                                <BookOpen className="h-4 w-4 text-blue-500" />
                            </div>
                            <div className="text-xl font-bold text-foreground">
                                {coursesCount}
                            </div>
                        </div>

                        <div className="p-3 rounded-lg border bg-card flex flex-col justify-between space-y-1">
                            <div className="flex items-center justify-between text-muted-foreground">
                                <span className="text-[11px] font-medium uppercase">Bài viết</span>
                                <FileText className="h-4 w-4 text-purple-500" />
                            </div>
                            <div className="text-xl font-bold text-foreground">
                                {postsCount}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Metadata */}
                    <div className="space-y-3 pt-1 text-sm">
                        <div className="p-3.5 rounded-lg border bg-muted/20 space-y-1.5">
                            <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                                <FileCode className="h-3.5 w-3.5" />
                                Mô tả tag
                            </span>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                {tag.description ? tag.description : <span className="italic text-muted-foreground">Chưa có mô tả cho nhãn này.</span>}
                            </p>
                        </div>

                        <div className="divide-y divide-border border rounded-lg px-3.5 py-1 bg-card">
                            <div className="flex items-center justify-between py-2.5">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Ngày tạo
                                </span>
                                <span className="text-xs font-medium">{formatDate(tag.createdAt)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2.5">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" />
                                    Cập nhật lần cuối
                                </span>
                                <span className="text-xs font-medium">{formatDate(tag.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="pt-2 border-t">
                    <Button variant="outline" onClick={closeDialog}>
                        Đóng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
