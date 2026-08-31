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
import { Home, Users, Settings, BookOpen, LayoutDashboard, User2, Tag } from "lucide-react"

// Sample menu items
const items = [
    {
        title: "Tổng quan",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Khoá học",
        url: "/admin/courses",
        icon: BookOpen,
    },
    {
        title: "Tags",
        url: "/admin/tags",
        icon: Tag,
    },
    {
        title: "Người dùng",
        url: "/admin/users",
        icon: Users,
    },
    {
        title: "Cài đặt",
        url: "/admin/settings",
        icon: Settings,
    },
]

import Link from "next/link"
import { NavUser } from "../shared/nav-user-admin"
import { useSession } from "next-auth/react"
import Logo from "../ui/logo"

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                <SidebarGroup>
                    <SidebarGroupLabel>Mục Quản lý</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
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