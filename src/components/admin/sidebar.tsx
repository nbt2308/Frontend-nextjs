"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Home, Users, Settings, BookOpen, LayoutDashboard, User2, Tag, ShieldCheck, Key, FileCheck, Grid2x2 } from "lucide-react"

// Sample menu items
const items = {
    title: "Tổng quan",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
}


const courseItems = [
    {
        title: "Tất cả khoá học",
        url: "/admin/courses",
        icon: BookOpen,
    },
    {
        title: "Duyệt khóa học",
        url: "/admin/moderation",
        icon: FileCheck,
    },
    {
        title: "Tags",
        url: "/admin/tags",
        icon: Tag,
    },
    {
        title: "Danh mục khóa học",
        url: "/admin/categories",
        icon: Grid2x2,
    },
]

const systemItems = [
    {
        title: "Quản lý người dùng",
        url: "/admin/users",
        icon: User2,
    },
    {
        title: "Vai trò & Phân quyền",
        url: "/admin/roles",
        icon: ShieldCheck,
    },
    {
        title: "Danh sách quyền",
        url: "/admin/permissions",
        icon: Key,
    }
]

import Link from "next/link"
import { NavUser } from "../shared/nav-user-admin"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Logo from "../ui/logo"

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const { data: session } = useSession()
    const user = {
        name: session?.user?.name as string,
        email: session?.user?.email as string,
        avatar: session?.user?.avatar as string,
    }
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/" className="flex justify-center gap-3">
                                <Logo size="sm" asDiv />
                                <span className="font-bold text-lg truncate group-data-[collapsible=icon]:hidden">
                                    Admin Panel
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {/* dashboard */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem key={items.title}>
                                <SidebarMenuButton asChild tooltip={items.title} isActive={pathname === items.url}>
                                    <Link href={items.url}>
                                        <items.icon />
                                        <span>{items.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {/* course management */}
                <SidebarGroup>
                    <SidebarGroupLabel>Quản lý khóa học</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {courseItems.map((item) => {
                                const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`)
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Hệ thống</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {systemItems.map((item) => {
                                const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`)
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    )
}