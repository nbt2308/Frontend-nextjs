"use client"

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, CircleCheck, Lock, Rocket, Sprout, Zap } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// import { UserCellAction } from "./user-cell-actions"
import { CourseType as ZodCourseType } from "@/types/generated-zod/schemas/models/Course.schema"
import { CourseTypeSchema, LevelSchema } from "@/types/generated-zod/schemas"
import { CourseCellAction } from "./course-cell-actions"


export const columns: ColumnDef<ZodCourseType>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "course_info",
        meta: {
            label: "Khóa học",
        },
        accessorFn: (row) => `${row.title} ${row.slug}`,
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
            )
        },
        cell: ({ row }) => {
            const course = row.original


            const getInitials = (title: string) => {
                return title ? title.substring(0, 2).toUpperCase() : "US"
            }
            return (
                <div className="flex items-center gap-3 py-1">
                    {/* Vòng tròn Avatar */}
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner shrink-0`}>
                        {course.thumbnail ? (
                            <img
                                src={course.thumbnail}
                                alt={course?.title?.slice(0, 2).toUpperCase()}
                                className="h-full w-full rounded-full object-cover"
                                onError={(e) => {

                                    (e.target as HTMLElement).style.display = 'none'
                                }}
                            />
                        ) : (
                            getInitials(course.title)
                        )}
                    </div>

                    <div className="leading-tight">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                            <span>{course.title}</span>
                        </div>
                        <span className="text-xs font-mono text-zinc-400">{course.slug}</span>
                    </div>
                </div>
            )
        },
    },
    {
        id: "courseType",
        meta: {
            label: "Loại",
        },
        accessorKey: "courseType",
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
                    Loại
                    {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                    {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            const courseType = row.getValue("courseType") as string
            const courseTypeBadgeClass = courseType === "FREE" ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" :
                courseType === "PAID" ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : ""
            const courseTypeText = courseType === "FREE" ? "Miễn phí" : "Trả phí"
            return (
                <Badge className={`text-xs font-medium px-2 py-1 rounded ${courseTypeBadgeClass}`}>
                    {courseTypeText}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableGlobalFilter: false
    },
    {
        id: "level",
        meta: {
            label: "Cấp độ",
        },
        accessorKey: "level",
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
                    Cấp độ
                    {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                    {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            const level = row.getValue("level") as string
            const levelIcon =
                level === LevelSchema.enum.BEGINNER ? <Sprout /> :
                    level === LevelSchema.enum.INTERMEDIATE ? <Zap /> :
                        level === LevelSchema.enum.ADVANCED ? <Rocket /> : ""

            const levelBadgeClass =
                level === LevelSchema.enum.BEGINNER ? "bg-sky-500/15 text-sky-500 dark:bg-sky-950 dark:text-sky-300" :
                    level === LevelSchema.enum.INTERMEDIATE ? "bg-violet-500/15 text-violet-500 dark:bg-violet-950 dark:text-violet-300" :
                        level === LevelSchema.enum.ADVANCED ? "bg-amber-500/15 text-amber-500 dark:bg-amber-950 dark:text-amber-300" : ""
            return (
                <Badge className={`text-xs font-medium px-2 py-1 rounded ${levelBadgeClass}`}>
                    {levelIcon}
                    {level}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableGlobalFilter: false
    },
    {
        id: "price",
        meta: {
            label: "Giá",
        },
        accessorKey: "price",
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
            )
        },
        cell: ({ row }) => {
            const { discount, price, courseType } = row.original as any;
            const originalPrice = parseFloat(price) || 0
            const salePrice = parseFloat(discount) || 0
            const hasDiscount = courseType === CourseTypeSchema.enum.PAID && salePrice > 0 && salePrice < originalPrice

            const formatter = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            })
            // if (courseType === CourseType.FREE) {
            //     return (
            //         <div className="font-medium">
            //             Miễn phí
            //         </div>
            //     )
            // }
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
        enableGlobalFilter: false
    },
    {
        id: "status",
        meta: {
            label: "Trạng thái",
        },
        accessorKey: "status",
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
                    Trạng thái
                    {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                    {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            const status = row.getValue("status") as boolean
            return (
                <Badge className={
                    status ?
                        "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                        :
                        "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                }>
                    {
                        status ?
                            <CircleCheck data-icon="inline-start" className="h-4 w-4" color="green" />
                            :
                            <Lock data-icon="inline-start" className="h-4 w-4" color="red" />
                    }
                    {status ? "Hoạt động" : "Bị khoá"}
                </Badge>
            )
        },
        filterFn: (row, id, filterValue) => {
            if (!filterValue || filterValue.length === 0) return true;

            // Chuyển giá trị boolean của hàng thành string: true -> "true"
            const rowValueString = String(row.getValue(id));

            return filterValue.includes(rowValueString);
        },
        enableGlobalFilter: false
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const course = row.original
            const status = row.getValue("status") as boolean
            return (
                <CourseCellAction course={course} status={status} />
            )
        },
        enableGlobalFilter: false
    },
]