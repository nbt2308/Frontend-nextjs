import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Edit, Info, Lock, MoreHorizontal, Trash2, Unlock } from "lucide-react"
import { useChangeStatus } from "@/hooks/useUser"

interface UserCellActionProps {
    user: any;
    status: boolean;
    onEdit: (user: any) => void;
    onView: (user: any) => void;
    onDelete: (user: any) => void;
}

export const UserCellAction = ({ user, status, onEdit, onView, onDelete }: UserCellActionProps) => {
    const { mutate: handleChangeStatus, isPending: isChangeStatusPending } = useChangeStatus();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => onView(user)}>
                    <Info className="h-4 w-4 mr-2" /> Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onEdit(user)}>
                    <Edit className="h-4 w-4 mr-2" /> Cập nhật người dùng
                </DropdownMenuItem>
                <DropdownMenuItem
                    onSelect={() => {
                        handleChangeStatus({
                            id: user?.id,
                            status: !status
                        })
                    }}
                    disabled={isChangeStatusPending}
                >
                    {
                        status ?
                            <Lock className="h-4 w-4 mr-2" />
                            :
                            <Unlock className="h-4 w-4 mr-2" />
                    }
                    {status ? "Khóa" : "Mở khóa"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={() => onDelete(user)}>
                    <Trash2 /> Xóa tài khoản
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}