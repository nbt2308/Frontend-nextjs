"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, BookOpen, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CourseStatusBadge } from "@/components/shared/courseStatus";
import { ModerationListCourse } from "./moderation.types";
import { formatDate, formatSectionDuration, getInitials } from "@/lib/utils";
import { CourseStatus, CourseTypeSchema } from "@/types/generated-zod/schemas";

export const getModerationColumns = (
    onReview: (course: ModerationListCourse) => void
): ColumnDef<ModerationListCourse>[] => [
        {
            id: "course_info",
            meta: {
                label: "Khóa học",
            },
            accessorFn: (row) => `${row.title} ${row.slug} ${row.instructor.name}`,
            header: ({ column }) => {
                const isSorted = column.getIsSorted();
                return (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            if (isSorted === "asc") {
                                column.toggleSorting(true);
                            } else if (isSorted === "desc") {
                                column.clearSorting();
                            } else {
                                column.toggleSorting(false);
                            }
                        }}
                    >
                        Khoá học
                        {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                        {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                        {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                    </Button>
                );
            },
            cell: ({ row }) => {
                const course = row.original;
                return (
                    <div className="flex items-center gap-3 py-1 min-w-[280px]">
                        <div className="h-11 w-16 rounded-md bg-muted overflow-hidden shrink-0 border border-border">
                            {course.thumbnail ? (
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-muted-foreground/40">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                            )}
                        </div>
                        <div className="leading-tight min-w-0">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onReview(course)}
                                className="cursor-pointer hover:bg-none bg-transparent font-semibold text-xs sm:text-sm text-left line-clamp-1 block"
                            >
                                {course.title}
                            </Button>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal">
                                    {course.level}
                                </Badge>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            id: "instructor",
            meta: {
                label: "Giảng viên",
            },
            accessorFn: (row) => row.instructor.name,
            header: "Giảng viên",
            cell: ({ row }) => {
                const instructor = row.original.instructor;
                return (
                    <div className="flex items-center gap-2 py-1 min-w-[150px]">
                        <Avatar className="h-7 w-7 border border-border shrink-0">
                            <AvatarImage src={instructor.avatar} alt={instructor.name} />
                            <AvatarFallback className="text-[10px]">
                                {getInitials(instructor.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 leading-tight">
                            <div className="text-xs font-medium text-foreground truncate">
                                {instructor.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground truncate">
                                {instructor.email}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            id: "category",
            meta: {
                label: "Danh mục",
            },
            accessorFn: (row) => row.category.name,
            header: "Danh mục",
            cell: ({ row }) => {
                return (
                    <Badge variant="outline" className="text-xs font-normal">
                        {row.original.category.name}
                    </Badge>
                );
            },
            filterFn: (row, id, filterValue) => {
                if (!filterValue || filterValue.length === 0) return true;
                const categoryName = row.getValue(id) as string;
                return filterValue.includes(categoryName);
            },
        },
        {
            id: "curriculum",
            meta: {
                label: "Nội dung",
            },
            header: "Chương / Bài",
            cell: ({ row }) => {
                const course = row.original;
                const allLessons = course.sections.flatMap((s) => s.lessons);
                const totalDuration = allLessons.reduce((acc, l) => acc + (l.duration || 0), 0);
                const previewCount = allLessons.filter((l) => l.isPreview).length;

                return (
                    <div className="space-y-0.5 text-xs text-muted-foreground min-w-[120px]">
                        <div className="text-foreground font-medium">
                            {course.sections.length} chương • {allLessons.length} bài
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                            <Clock className="h-3 w-3" />
                            <span>{formatSectionDuration(totalDuration)}</span>
                            {previewCount > 0 && (
                                <span className="text-amber-500 font-medium">({previewCount} preview)</span>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            id: "price",
            meta: {
                label: "Giá",
            },
            accessorFn: (row) => row.price,
            header: ({ column }) => {
                const isSorted = column.getIsSorted();
                return (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            if (isSorted === "asc") {
                                column.toggleSorting(true);
                            } else if (isSorted === "desc") {
                                column.clearSorting();
                            } else {
                                column.toggleSorting(false);
                            }
                        }}
                    >
                        Giá
                        {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                        {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                        {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                    </Button>
                );
            },
            cell: ({ row }) => {
                const course = row.original;
                const { discount, price, courseType } = row.original as any;
                const originalPrice = parseFloat(price) || 0
                const salePrice = parseFloat(discount) || 0
                const hasDiscount = courseType === CourseTypeSchema.enum.PAID && salePrice > 0 && salePrice < originalPrice
                const CourseType = CourseTypeSchema.enum;

                const formatter = new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                })

                if (course.courseType === CourseType.FREE) {
                    return (
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                            Miễn phí
                        </Badge>
                    );
                }

                if (hasDiscount) {
                    const discountPercent = Math.round(
                        ((originalPrice - salePrice) / originalPrice) * 100
                    )

                    return (
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5">
                                <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-950/50 dark:text-red-400">
                                    -{discountPercent}%
                                </span>
                                <span className="font-semibold text-foreground">
                                    {formatter.format(salePrice)}
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground line-through">
                                {formatter.format(originalPrice)}
                            </span>
                        </div>
                    )
                }

                return (
                    <Badge variant="default" className="text-md">
                        {formatter.format(originalPrice)}
                    </Badge>
                )
            },
        },

        {
            id: "status",
            meta: {
                label: "Trạng thái",
            },
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => {
                const status = row.getValue("status") as CourseStatus;
                return <CourseStatusBadge status={status} />;
            },
            filterFn: (row, id, filterValue) => {
                if (!filterValue || filterValue.length === 0) return true;
                const status = String(row.getValue(id));
                return filterValue.includes(status);
            },
        },
        {
            id: "submittedAt",
            meta: {
                label: "Ngày gửi",
            },
            accessorKey: "submittedAt",
            header: "Ngày gửi",
            cell: ({ row }) => {
                return (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(row.original.submittedAt)}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: () => <span className="sr-only">Thao tác</span>,
            cell: ({ row }) => {
                const course = row.original;
                return (
                    <div className="flex justify-end">
                        <Button
                            size="sm"
                            onClick={() => onReview(course)}
                            className="h-8 text-xs font-semibold px-2.5 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                        >
                            <Eye className="h-3.5 w-3.5" />
                            Review
                        </Button>
                    </div>
                );
            },
        },
    ];
