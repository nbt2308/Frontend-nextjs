import { MoreHorizontal, Trash2, ShieldCheck, ShieldAlert, Pencil, Copy, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface RoleCellActionProps {
    role: any;
    status: boolean;
    onEdit: (role: any) => void;
    onDelete: (role: any) => void;
}

export function RoleCellAction({ role, status, onEdit, onDelete }: RoleCellActionProps) {
    const handleCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success("Đã copy ID vai trò")
    }

    return (
        <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleCopy(role.id)}>
                        <Copy className="h-4 w-4 mr-2" /> Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => onEdit(role)}
                        className="cursor-pointer"
                    >
                        <Edit className="h-4 w-4 mr-2" /> Cập nhật vai trò
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => onDelete(role)}
                        variant="destructive"
                    >
                        <Trash2 className="h-4 w-4 mr-2" /> Xoá vai trò
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
    )
}
