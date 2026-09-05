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
import { IUser } from "@/types/next-auth"
interface DropdownMenuAvatarProps {
    user: IUser;
}
export function DropdownMenuAvatar({ user }: DropdownMenuAvatarProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                        {user.avatar && <AvatarImage src={user.avatar} alt="shadcn" />}
                        <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
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
                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                    className="cursor-pointer flex items-center gap-2 text-red-500 focus:bg-red-50 dark:focus:bg-red-950/50"
                >
                    <LogOutIcon className="h-4 w-4" />
                    <span>Đăng xuất</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
