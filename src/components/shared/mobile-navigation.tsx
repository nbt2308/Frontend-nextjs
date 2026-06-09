"use client"

import * as React from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"
import { Home, BookOpen, Newspaper, Tag, Info } from "lucide-react"

export function MobileNavigation() {
    const [open, setOpen] = React.useState(false)

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
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                    <SheetTitle className="text-left">
                        <Link href={"/"} className="flex flex-row items-center gap-2" onClick={() => setOpen(false)}>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950">
                                <span className="font-mono text-lg font-bold">N</span>
                            </div>
                            <span className="text-xl font-mono font-bold tracking-tight text-zinc-900 dark:text-white">
                                Neva<span className="font-light text-zinc-600">GIVEUP</span>
                            </span>
                        </Link>
                    </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 ml-2">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-4 text-lg font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
                        >
                            <item.icon className="h-6 w-6" />
                            {item.title}
                        </Link>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}
