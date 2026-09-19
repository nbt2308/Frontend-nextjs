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
import { useChangeStatus } from "@/hooks/useTag"

interface TagCellActionProps {
    tag: any;
    status: boolean;
    onEdit: (tag: any) => void;
    onView: (tag: any) => void;
    onDelete: (tag: any) => void;
}

export const TagCellAction = ({ tag, status, onEdit, onView, onDelete }: TagCellActionProps) => {
    const { mutate: handleChangeStatus, isPending } = useChangeStatus();

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
                    <DropdownMenuItem onSelect={() => onView(tag)}>
                        <Info className="h-4 w-4 mr-2" /> Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onEdit(tag)}>
                        <Edit className="h-4 w-4 mr-2" /> Cập nhật Tag
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            handleChangeStatus({
                                id: tag?.id,
                                status: !status
                            })
                        }}
                        disabled={isPending}
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
                    <DropdownMenuItem variant="destructive" onSelect={() => onDelete(tag)}>
                        <Trash2 /> Xóa tag
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
    )
}