"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, Lock, FolderTree, BookOpen, Calendar, Hash, Globe, Clock, FileCode, FolderGit2, Folder } from "lucide-react";
import React from "react";
import { CategoryType } from "@/types/generated-zod/schemas/models/Category.schema";
import { formatDate } from "@/lib/utils";
import { useAllCategories } from "@/hooks/useCategory";

interface ModalViewCategoryProps {
    open: boolean;
    closeDialog: () => void;
    category?: CategoryType | any;
}

export default function ModalViewCategory({ open, closeDialog, category }: ModalViewCategoryProps) {
    const { data: allCategories } = useAllCategories();

    if (!category) return null;

    const coursesCount = category?._count?.courses ?? (category?.courses?.length || 0);
    const subCategoriesCount = category?._count?.children ?? (category?.children?.length || 0);

    const getParentName = (parentId: number | null) => {
        if (!parentId || !allCategories?.categories) return null;
        
        const findCat = (cats: any[], searchId: number): any => {
            for (const c of cats) {
                if (c.id === searchId) return c;
                if (c.children) {
                    const found = findCat(c.children, searchId);
                    if (found) return found;
                }
            }
            return null;
        }

        const parent = findCat(allCategories.categories, parentId);
        return parent?.name || null;
    }

    const parentName = getParentName(category.parentId);
    const depth = category.parentId === null ? 0 : (parentName ? (/* could check grandparent */ 1) : 1);
    
    // We can assume depth from the data structure, but simplest is to check if parent has a parent.
    const isLevel2 = Boolean(category.parentId && (() => {
        if (!allCategories?.categories) return false;
        const findCat = (cats: any[], searchId: number): any => {
            for (const c of cats) {
                if (c.id === searchId) return c;
                if (c.children) {
                    const found = findCat(c.children, searchId);
                    if (found) return found;
                }
            }
            return null;
        }
        const p = findCat(allCategories.categories, category.parentId);
        return p?.parentId !== null;
    })());
    
    const actualDepth = category.parentId === null ? 0 : (isLevel2 ? 2 : 1);

    return (
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) closeDialog(); }}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
                <DialogHeader className="space-y-1">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <FolderTree className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">Chi Tiết Danh Mục</DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                Thông tin tổng quan và chi tiết của danh mục #{category.id}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <Separator />

                <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-2">
                    {/* Category Summary Header Card */}
                    <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                {category.thumbnail ? (
                                    <img src={category.thumbnail} alt={category.name} className="w-12 h-12 rounded-lg object-cover border" />
                                ) : (
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border
                                        ${actualDepth === 0 ? 'bg-brand-100 text-brand-600 border-brand-200' :
                                          actualDepth === 1 ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                          'bg-indigo-50 text-indigo-600 border-indigo-200'}
                                    `}>
                                        {actualDepth === 0 ? <Folder className="w-6 h-6" /> :
                                         actualDepth === 1 ? <FolderGit2 className="w-5 h-5" /> :
                                         <FileCode className="w-4 h-4" />}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                        <span>{category.name}</span>
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono mt-0.5">
                                        <Globe className="h-3.5 w-3.5 text-zinc-400" />
                                        <span>{category.slug}</span>
                                    </div>
                                </div>
                            </div>
                            <Badge variant="outline" className="font-mono text-xs px-2.5 py-1 bg-background shrink-0">
                                <Hash className="h-3 w-3 mr-1 text-muted-foreground" />
                                ID: {category.id}
                            </Badge>
                        </div>
                    </div>

                    {/* Stats Summary Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg border bg-card flex flex-col justify-between space-y-2">
                            <span className="text-[11px] font-medium text-muted-foreground uppercase">Trạng thái</span>
                            <div>
                                <Badge className={
                                    category.status ?
                                        "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                                        :
                                        "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                                }>
                                    {category.status ? (
                                        <CircleCheck className="mr-1 h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                        <Lock className="mr-1 h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                                    )}
                                    {category.status ? "Hoạt động" : "Bị khóa"}
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
                                <span className="text-[11px] font-medium uppercase">Danh mục con</span>
                                <FolderTree className="h-4 w-4 text-purple-500" />
                            </div>
                            <div className="text-xl font-bold text-foreground">
                                {subCategoriesCount}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Metadata */}
                    <div className="space-y-3 pt-1 text-sm">
                        
                        {parentName && (
                            <div className="p-3.5 rounded-lg border bg-blue-50/50 dark:bg-blue-950/20 space-y-1.5 flex justify-between items-center">
                                <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                                    <FolderTree className="h-3.5 w-3.5" />
                                    Thuộc danh mục cha
                                </span>
                                <Badge variant="secondary" className="font-medium text-xs bg-white dark:bg-zinc-900 border-zinc-200">
                                    {parentName}
                                </Badge>
                            </div>
                        )}

                        <div className="p-3.5 rounded-lg border bg-muted/20 space-y-1.5">
                            <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                                <FileCode className="h-3.5 w-3.5" />
                                Mô tả danh mục
                            </span>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                {category.description ? category.description : <span className="italic text-muted-foreground">Chưa có mô tả cho danh mục này.</span>}
                            </p>
                        </div>

                        <div className="divide-y divide-border border rounded-lg px-3.5 py-1 bg-card">
                            <div className="flex items-center justify-between py-2.5">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Ngày tạo
                                </span>
                                <span className="text-xs font-medium">{formatDate(category.createdAt)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2.5">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" />
                                    Cập nhật lần cuối
                                </span>
                                <span className="text-xs font-medium">{formatDate(category.updatedAt)}</span>
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
