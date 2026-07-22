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
import { Home, Users, Settings, BookOpen, LayoutDashboard, User2 } from "lucide-react"

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

export function AdminSidebar() {
    const { data: session } = useSession()
    const user = {
        name: session?.user?.name as string,
        email: session?.user?.email as string,
        avatar: session?.user?.image as string,
    }
    return (
        <Sidebar>
            <SidebarHeader className="h-16 flex items-center justify-center border-b px-4">
                <span className="font-bold text-lg flex gap-2"><Logo size="sm" />Admin Panel</span>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
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