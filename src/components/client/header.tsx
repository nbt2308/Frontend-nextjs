
import { ModeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import { Menu, ChevronDown, Home, BookOpen, FileText, Info, Mail, Sun, Moon, User, Settings, LogOut } from "lucide-react"
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { DropdownMenuAvatar } from "../shared/user-dropdown-avatar";

export default function Header() {
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
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link href="/docs">Docs</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    {/* <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button> */}
                    <DropdownMenuAvatar />
                </div>

            </div>
        </header>
    );
}