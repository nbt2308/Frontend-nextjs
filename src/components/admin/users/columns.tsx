"use client"

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, BadgeCheck, Ban, CircleCheck, Edit, Info, Lock, Mail, Phone, ShieldCheck, ShieldX, Trash2, Unlock } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserCellAction } from "./user-cell-actions"
import { UserType } from "@/types/generated-zod/schemas/models/User.schema"
import { UserRoleType } from "@/types/generated-zod/schemas/models/UserRole.schema"
import { RoleType } from "@/types/generated-zod/schemas/models/Role.schema"
// Định nghĩa kiểu dữ liệu cho User
export type User = {
    avatar: string
    id: number
    name: string
    email: string
    phone: string
    role: "ADMIN" | "INSTRUCTOR" | "STUDENT"
    status: boolean
    isActive: boolean
    createdAt: Date
}

export const columns: ColumnDef<UserType>[] = [
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
        id: "user_profile",
        meta: {
            label: "Thành viên",
        },
        accessorFn: (row) => `${row.name} ${row.id}`,
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
                    Thành viên
                    {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                    {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            const user = row.original


            const getInitials = (name: string) => {
                return name ? name.substring(0, 2).toUpperCase() : "US"
            }
            return (
                <div className="flex items-center gap-3 py-1">
                    {/* Vòng tròn Avatar */}
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner shrink-0`}>
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user?.name?.slice(0, 2).toUpperCase()}
                                className="h-full w-full rounded-full object-cover"
                                onError={(e) => {

                                    (e.target as HTMLElement).style.display = 'none'
                                }}
                            />
                        ) : (
                            getInitials(user.name)
                        )}
                    </div>

                    <div className="leading-tight">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                            <span>{user.name}</span>
                        </div>
                        <span className="text-xs font-mono text-zinc-400">{user.id}</span>
                    </div>
                </div>
            )
        },
    },
    {
        id: "contact",
        meta: {
            label: "Liên hệ",
        },
        accessorFn: (row) => `${row.email} ${(row as any).phone || ""}`,
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
                    Liên hệ
                    {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                    {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            const email = row.original.email as string;
            const phone = (row.original as any).phone;

            return (
                <div className="flex flex-col gap-1 text-sm text-zinc-500">
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{email}</span>
                    </div>
                    {phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{phone}</span>
                        </div>
                    )}
                </div>
            )
        }
    },
    {
        id: "roles",
        meta: {
            label: "Vai trò",
        },
        accessorKey: "roles",
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
                    Vai trò
                    {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                    {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            const roles = row.getValue("roles") as RoleType[]

            return (
                <div className="flex flex-wrap gap-1">
                    {roles.map((item) => (
                        <span
                            key={item.id}
                            className="text-xs font-medium px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                        >
                            {item.name}
                        </span>
                    ))}
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableGlobalFilter: false
    },
    {
        id: "status",
        meta: {
            label: "Trạng thái tài khoản",
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
                    Trạng thái tài khoản
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
        id: "isActive",
        meta: {
            label: "Xác thực",
        },
        accessorKey: "isActive",
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
                    Xác thực
                    {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
                    {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
                    {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            )
        },
        cell: ({ row }) => {
            const status = row.getValue("isActive") as boolean
            return (
                <Badge className={
                    status ?
                        "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                        :
                        "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                }>
                    {
                        status ?
                            <ShieldCheck data-icon="inline-start" className="h-4 w-4" color="green" />
                            :
                            <ShieldX data-icon="inline-start" className="h-4 w-4" color="red" />
                    }
                    {status ? "Đã kích hoạt" : "Chưa kích hoạt"}
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
            const user = row.original
            const status = row.getValue("status") as boolean
            return (
                <UserCellAction user={user} status={status} />
            )
        },
        enableGlobalFilter: false
    },
]