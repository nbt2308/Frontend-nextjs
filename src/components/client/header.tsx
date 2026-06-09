"use client"

import * as React from "react"
import { ModeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import { Home, BookOpen, Newspaper, Tag, Info } from "lucide-react"
import Link from "next/link";
import { cn } from "@/lib/utils"
import { MobileNavigation } from "../shared/mobile-navigation";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { DropdownMenuAvatar } from "../shared/user-dropdown-avatar";
import LoginButton from "../shared/login-button";

export default function Header() {
    const menuItems = [
        {
            title: "Trang chủ",
            href: "/",
            icon: Home,
        },
        {
            title: "Khóa Học",
            href: "/course",
            icon: BookOpen,
        },
        {
            title: "Bài viết",
            href: "/posts",
            icon: Newspaper,
        },
        {
            title: "Tags",
            href: "/tags",
            icon: Tag,
        },
        {
            title: "Về chúng tôi",
            href: "/about",
            icon: Info,
        },
    ]
    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="container mx-auto flex h-16 items-center justify-between px-6 md:px-10">
                <Link href={"/"} className="flex flex-row items-center gap-2 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white transition-transform group-hover:scale-105 dark:bg-white dark:text-zinc-950 ">
                        <span className="font-mono text-xl font-bold">N</span>
                    </div>
                    <span className="text-xl font-mono font-bold tracking-tight text-zinc-900 dark:text-white">
                        Neva
                        <span className="font-light text-zinc-600">
                            GIVEUP
                        </span>
                    </span>
                </Link>
                <div className="hidden md:flex">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {menuItems.map((item, index) => (
                                <NavigationMenuItem key={index} className="cursor-pointer">
                                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                        <Link
                                            href={item.href}
                                            className="group relative flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors duration-200"
                                        >
                                            <item.icon className="h-4 w-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110" />
                                            <span>{item.title}</span>
                                            <span className="absolute bottom-0 left-4 right-4 h-[2px] scale-x-0 bg-zinc-950 dark:bg-white transition-transform duration-300 ease-out origin-left group-hover:scale-x-100" />
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <LoginButton />
                    {/* <DropdownMenuAvatar /> */}
                    <MobileNavigation />
                </div>

            </div>
        </header>
    );
}