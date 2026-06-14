import {
    CreditCardIcon,
    HeartIcon,
    LogOutIcon,
    User,
} from "lucide-react"

import {
    Avatar,
    AvatarBadge,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
export function DropdownMenuAvatar() {
    const { data: session } = useSession()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                        {session?.user?.image && <AvatarImage src={session?.user?.image} alt="shadcn" />}
                        <AvatarFallback>{session?.user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User />
                        Tài khoản
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <HeartIcon />
                        Danh sách yêu thích
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreditCardIcon />
                        Đơn hàng
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => signOut()}
                    className="cursor-pointer flex items-center gap-2 text-red-500 focus:bg-red-50 dark:focus:bg-red-950/50"
                >
                    <LogOutIcon className="h-4 w-4" />
                    <span>Đăng xuất</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
